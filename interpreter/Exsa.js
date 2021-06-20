import Environment from "./Environment";
import ExsaParser from "../parser/Parser";

import { astTypes, astHelpers } from "../parser/AstFactory";

import fs from "fs";
import path from "path";

class Exsa {
  constructor(global) {
    const newGlobalConfig = { ...GlobalEnvironmentConfig };
    this.global = global ? global : new Environment(newGlobalConfig);
    this.hiddenEnv = new Environment({});

    this._parser = new ExsaParser();
  }

  evalGlobal(exp, logAst = false) {
    const ast = this._parser.parse(exp);
    if (logAst) {
      console.log(JSON.stringify(ast, null, 2));
    }
    return this._evalBody(ast, this.global);
  }

  eval(ast, env = this.global) {
    if (!ast) return null;

    if (ast.type === astTypes.ExpressionStatement) {
      return this.eval(ast.expression, env);
    }

    if (astHelpers._isLiteral(ast.type)) {
      return ast.value;
    }

    if (ast.type === astTypes.Identifier) {
      return env.lookup(ast.name);
    }

    if (ast.type === astTypes.BinaryExpression) {
      return this._execBinaryOperator(
        ast.operator,
        this.eval(ast.left, env),
        this.eval(ast.right, env)
      );
    }

    if (ast.type === astTypes.BlockStatement) {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(ast.body, blockEnv);
    }

    if (ast.type === astTypes.AssignmentExpression) {
      if (ast.left.type === astTypes.MemberExpression) {
        const { computed, object, property } = ast.left;

        const prop = computed ? this.eval(property, env) : property;
        if (ast.operator !== "=") {
          throw new SyntaxError(
            `Unexpected token: ${ast.operator}, expected '='`
          );
        }

        const defineEnv = this.eval(object, env);

        if (!defineEnv.define) {
          const assignRight = this.eval(ast.right, env);
          defineEnv[prop.name || prop.value || prop] = assignRight;
          return assignRight;
        }

        return defineEnv.define(
          prop.name || prop.value,
          this.eval(ast.right, env)
        );
      }

      return env.assign(
        ast.left.name,
        this._execAssignOperator(
          ast.operator,
          this.eval(ast.left, env),
          this.eval(ast.right, env)
        )
      );
    }

    if (ast.type === astTypes.LogicalExpression) {
      return this._execLogicalOperator(
        ast.operator,
        this.eval(ast.left, env),
        this.eval(ast.right, env)
      );
    }

    if (ast.type === astTypes.VariableStatement) {
      return this._evalDeclarations(ast.declarations, env);
    }

    if (ast.type === astTypes.IfStatement) {
      if (this.eval(ast.test, env)) {
        return this.eval(ast.consequent, env);
      }
      return this.eval(ast.alternate, env);
    }

    if (ast.type === astTypes.UnaryExpression) {
      return this._execUnaryOperator(
        ast.operator,
        this.eval(ast.argument, env)
      );
    }

    if (ast.type === astTypes.FunctionDeclaration) {
      const { name, params, body } = ast;
      const fn = {
        params,
        body,
        env, // Closure
      };

      return name ? env.define(name.name, fn) : fn;
    }

    if (ast.type === astTypes.CallExpression) {
      if (ast.callee.type === astTypes.MemberExpression) {
        const { computed, object, property } = ast.callee;
        const args = ast.arguments.map((exp) => this.eval(exp, env));

        const prop = computed ? this.eval(property, env) : property;

        const callEnv = this.eval(object, env);
        if (!callEnv.lookup) {
          return callEnv[prop.name || prop.value || prop](...args);
        }

        return this._callUserDefinedFunction(
          callEnv.lookup(prop.name),
          args,
          callEnv
        );
      }

      const { fn, args } = this._prepareCallee(ast.callee, ast.arguments, env);

      if (typeof fn === "function") {
        return fn(...args);
      }

      return this._callUserDefinedFunction(fn, args, fn.env);
    }

    if (ast.type === astTypes.ReturnStatement) {
      this.hiddenEnv.setHiddenValue("isReturn", true);
      return this.eval(ast.argument, env);
    }

    if (ast.type === astTypes.WhileStatement) {
      let result;
      while (this.eval(ast.test, env)) {
        result = this.eval(ast.body, env);
        const isReturn = this.hiddenEnv.getHiddenValue("isReturn");
        if (isReturn) break;
      }
      return result;
    }

    if (ast.type === astTypes.ForStatement) {
      const { init, test, update, body } = ast;
      let result;
      for (this.eval(init, env); this.eval(test, env); this.eval(update, env)) {
        result = this.eval(body, env);
        const isReturn = this.hiddenEnv.getHiddenValue("isReturn");
        if (isReturn) break;
      }
      return result;
    }

    if (ast.type === astTypes.DoWhileStatement) {
      let result;
      do {
        result = this.eval(ast.body, env);
        const isReturn = this.hiddenEnv.getHiddenValue("isReturn");
        if (isReturn) break;
      } while (this.eval(ast.test, env));
      return result;
    }

    // if (ast.type === astTypes.ForEachStatement) {
    //   const { left, right, body } = ast;
    //   let result;
    //   for(this.eval(left) of this.eval(right)) {
    //     result = body;
    //   }
    //   return result
    // }

    if (ast.type === astTypes.ClassDeclaration) {
      const { id, superClass, body } = ast;

      const parentEnv = this.eval(superClass, env) || env;
      const classEnv = new Environment({}, parentEnv);

      this._evalBlock(body.body, classEnv);

      return env.define(id.name, classEnv);
    }

    if (ast.type === astTypes.Super) {
      const parentConstructor = env.parent.parent.lookup("constructor");
      parentConstructor.env.define("this", env.lookup("this"));
      return parentConstructor;
    }

    if (ast.type === astTypes.NewExpression) {
      const { fn: classEnv, args } = this._prepareCallee(
        ast.callee,
        ast.arguments,
        env
      );

      const instanceEnv = new Environment({}, classEnv);
      instanceEnv.define("this", instanceEnv);

      this._callUserDefinedFunction(
        classEnv.lookup("constructor"),
        args,
        instanceEnv
      );

      return instanceEnv;
    }

    if (ast.type === astTypes.MemberExpression) {
      const { computed, object, property } = ast;

      const prop = computed ? this.eval(property, env) : property;
      const localObj = this.eval(object, env);

      if (localObj.lookup) {
        return localObj.lookup(prop.name || prop.value);
      } else {
        if (typeof prop === "object") {
          return localObj[prop.name || prop.value];
        }
        return localObj[prop];
      }
    }

    if (ast.type === astTypes.ComputedExpression) {
      return this.eval(ast.expression, env);
    }

    if (ast.type === astTypes.ObjectLiteral) {
      const properties = ast.properties
        .map((prop) => this.eval(prop, env))
        .reduce((acc, prop) => ({ ...acc, ...prop }), {});

      return properties;
    }

    if (ast.type === astTypes.ArrayLiteral) {
      const arrayItems = ast.list.map((item) => this.eval(item, env));

      return arrayItems;
    }

    if (ast.type === astTypes.Property) {
      const value = this.eval(ast.value, env);

      if (ast.name.name) {
        return { [ast.name.name]: value };
      }

      return { [this.eval(ast.name, env)]: value };
    }

    if (ast.type === astTypes.EmptyStatement) {
      return null;
    }

    if (ast.type === astTypes.ImportStatement) {
      const { id, path: pathName } = ast;
      const moduleSrc = fs.readFileSync(
        path.resolve("", this.eval(pathName, env)),
        "utf8"
      );
      const moduleAst = this._parser.parse(moduleSrc);

      const moduleEnv = new Environment({}, env);
      this._evalBody(moduleAst, moduleEnv);

      return env.define(id.name, moduleEnv);
    }

    throw `Unimplemented: ${JSON.stringify(ast)}`;
  }

  _evalBody(body, env) {
    if (body.type === astTypes.Program) {
      return this._evalBlock(body.body, env);
    }
    return this.eval(body, env);
  }

  _evalBlock(block, env, isFunction) {
    let result;

    for (const exp of block) {
      result = this.eval(exp, env);
      const isReturn = this.hiddenEnv.getHiddenValue("isReturn");

      if (isReturn && isFunction) {
        this.hiddenEnv.setHiddenValue("isReturn", false);
        return result;
      }
    }

    return result;
  }

  _prepareCallee(callee, params, env) {
    const fn = this.eval(callee, env);
    const args = params.map((exp) => this.eval(exp, env));

    return { fn, args };
  }

  _callUserDefinedFunction(fn, args, env) {
    const activationRecord = {};

    fn.params.forEach((param, index) => {
      activationRecord[param.name] = args[index];
    });

    const activationEnv = new Environment(activationRecord, env);

    return this._evalBlock(fn.body.body, activationEnv, true);
  }

  _evalDeclarations(declarations, env) {
    let result;

    declarations.forEach((exp) => {
      result = env.define(exp.id.name, this.eval(exp.init, env));
    });

    return result;
  }

  _execBinaryOperator(operator, left, right) {
    return {
      "+": () => left + right,
      "-": () => left - right,
      "/": () => left / right,
      "*": () => left * right,
      "**": () => left ** right,
      ">": () => left > right,
      ">=": () => left >= right,
      "<": () => left < right,
      "<=": () => left <= right,
      "==": () => left === right,
    }[operator]();
  }

  _execAssignOperator(operator, left, right) {
    return {
      "+=": () => left + right,
      "-=": () => left - right,
      "/=": () => left / right,
      "*=": () => left * right,
      "=": () => right,
    }[operator]();
  }

  _execLogicalOperator(operator, left, right) {
    return {
      and: () => left && right,
      or: () => left || right,
    }[operator]();
  }

  _execUnaryOperator(operator, arg) {
    return {
      not: () => !arg,
      "-": () => -arg,
      "+": () => +arg,
    }[operator]();
  }
}

/**
 * Default Global Environment.
 */
const GlobalEnvironmentConfig = {
  VERSION: "0.1",

  print(...args) {
    console.log(...args);
  },

  Array: global.Array,
  Object: global.Object,
  Math: global.Math,
  Promise: global.Promise,
};

export default Exsa;
