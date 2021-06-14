export const astTypes = {
  Program: "Program",

  BlockStatement: "BlockStatement",
  EmptyStatement: "EmptyStatement",
  IfStatement: "IfStatement",
  ExpressionStatement: "ExpressionStatement",
  VariableStatement: "VariableStatement",
  WhileStatement: "WhileStatement",
  ForStatement: "ForStatement",
  ForEachStatement: "ForEachStatement",
  ReturnStatement: "ReturnStatement",
  DoWhileStatement: "DoWhileStatement",
  ImportStatement: "ImportStatement",

  StringLiteral: "StringLiteral",
  NumericLiteral: "NumericLiteral",
  BooleanLiteral: "BooleanLiteral",
  NullLiteral: "NullLiteral",
  UndefinedLiteral: "UndefinedLiteral",
  ObjectLiteral: "ObjectLiteral",
  ArrayLiteral: "ArrayLiteral",
  Identifier: "Identifier",

  AssignmentExpression: "AssignmentExpression",
  BinaryExpression: "BinaryExpression",
  LogicalExpression: "LogicalExpression",
  UnaryExpression: "UnaryExpression",
  MemberExpression: "MemberExpression",
  CallExpression: "CallExpression",
  ThisExpression: "ThisExpression",
  NewExpression: "NewExpression",
  ComputedExpression: "ComputedExpression",

  VariableDeclaration: "VariableDeclaration",
  FunctionDeclaration: "FunctionDeclaration",
  ClassDeclaration: "ClassDeclaration",

  Super: "Super",
  Property: "Property",
};

export const astHelpers = {
  _isLiteral: (type) =>
    [
      astTypes.StringLiteral,
      astTypes.NumericLiteral,
      astTypes.BooleanLiteral,
      astTypes.NullLiteral,
      astTypes.UndefinedLiteral,
    ].includes(type),
};

export const factory = {
  Program: (body) => ({
    type: astTypes.Program,
    body,
  }),

  BlockStatement: (body) => ({
    type: astTypes.BlockStatement,
    body,
  }),

  EmptyStatement: () => ({
    type: astTypes.EmptyStatement,
  }),

  ExpressionStatement: (expression) => ({
    type: astTypes.ExpressionStatement,
    expression,
  }),

  StringLiteral: (value) => ({
    type: astTypes.StringLiteral,
    value,
  }),

  NumericLiteral: (value) => ({
    type: astTypes.NumericLiteral,
    value,
  }),

  BinaryExpression: (operator, left, right) => ({
    type: astTypes.BinaryExpression,
    operator,
    left,
    right,
  }),

  LogicalExpression: (operator, left, right) => ({
    type: astTypes.LogicalExpression,
    operator,
    left,
    right,
  }),

  AssignmentExpression: (operator, left, right) => ({
    type: astTypes.AssignmentExpression,
    operator: operator,
    left,
    right,
  }),

  Identifier: (name) => ({
    type: astTypes.Identifier,
    name,
  }),

  VariableStatement: (declarations) => ({
    type: astTypes.VariableStatement,
    declarations,
  }),

  VariableDeclaration: (id, init) => ({
    type: astTypes.VariableDeclaration,
    id,
    init,
  }),

  IfStatement: (test, consequent, alternate) => ({
    type: astTypes.IfStatement,
    test,
    consequent,
    alternate,
  }),

  BooleanLiteral: (value) => ({
    type: astTypes.BooleanLiteral,
    value,
  }),

  NullLiteral: (value) => ({
    type: astTypes.NullLiteral,
    value,
  }),

  UndefinedLiteral: (value) => ({
    type: astTypes.UndefinedLiteral,
    value,
  }),

  UnaryExpression: (operator, argument) => ({
    type: astTypes.UnaryExpression,
    operator,
    argument,
  }),

  WhileStatement: (test, body) => ({
    type: astTypes.WhileStatement,
    test,
    body,
  }),

  DoWhileStatement: (test, body) => ({
    type: astTypes.DoWhileStatement,
    test,
    body,
  }),

  ForStatement: (init, test, update, body) => ({
    type: astTypes.ForStatement,
    init,
    test,
    update,
    body,
  }),

  ForEachStatement: (left, right, body) => ({
    type: astTypes.ForEachStatement,
    left,
    right,
    body,
  }),

  FunctionDeclaration: (name, params, body) => ({
    type: astTypes.FunctionDeclaration,
    name,
    params,
    body,
  }),

  ReturnStatement: (argument) => ({
    type: astTypes.ReturnStatement,
    argument,
  }),

  MemberExpression: (computed, object, property) => ({
    type: astTypes.MemberExpression,
    computed,
    object,
    property,
  }),

  ComputedExpression: (expression) => ({
    type: astTypes.ComputedExpression,
    expression,
  }),

  CallExpression: (callee, args) => ({
    type: astTypes.CallExpression,
    callee,
    arguments: args,
  }),

  ObjectLiteral: (properties) => ({
    type: astTypes.ObjectLiteral,
    properties,
  }),

  ArrayLiteral: (list) => ({
    type: astTypes.ArrayLiteral,
    list,
  }),

  Property: (name, value) => ({
    type: astTypes.Property,
    name,
    value,
  }),

  ClassDeclaration: (id, superClass, body) => ({
    type: astTypes.ClassDeclaration,
    id,
    superClass,
    body,
  }),

  ThisExpression: () => ({
    type: astTypes.ThisExpression,
  }),

  Super: () => ({
    type: astTypes.Super,
  }),

  NewExpression: (callee, args) => ({
    type: astTypes.NewExpression,
    callee,
    arguments: args,
  }),

  ImportStatement: (id, path) => ({
    type: astTypes.ImportStatement,
    id,
    path,
  }),

  _checkValidAssignmentTarget: (node) => {
    if (
      node.type === astTypes.Identifier ||
      node.type === astTypes.MemberExpression
    ) {
      return node;
    }

    throw new SyntaxError("Invalid left-hand side in assignment expression");
  },
};
