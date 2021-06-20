import { Tokenizer } from "./Tokenizer";
import { tokens } from "./SpecTokens";
import { factory, astTypes } from "./AstFactory";

export class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string) {
    this._string = string;
    this._tokenizer.init(string);
    this._tokenizer.tokenizeSource();

    this._cursor = 0;

    this._lookahead = this.#nextMove();

    return this.Program();
  }

  #nextMove() {
    return this._tokenizer.getMove(this._cursor++);
  }

  #eat(tokenType) {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(`Unexpected end of input, expected ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: ${token.value}, expected ${tokenType}`
      );
    }

    this._lookahead = this.#nextMove();

    return token;
  }

  #binaryExpressionGenerator(
    BaseStatement,
    stopLookahead,
    nodeGenerator = factory.BinaryExpression
  ) {
    let left = BaseStatement();

    while (this._lookahead !== null && this._lookahead.type === stopLookahead) {
      const operator = this.#eat(stopLookahead);
      const right = BaseStatement();

      left = nodeGenerator(operator.value, left, right);
    }

    return left;
  }

  #isAssignmentOperator(tokenType) {
    return [tokens.SIMPLE_ASSIGN, tokens.COMPLEX_ASSIGN].includes(tokenType);
  }

  #returnCursorToPosition(position, lookahead) {
    this._cursor = position;
    this._lookahead = lookahead;
  }

  #isObjectLiteral() {
    const startCursor = this._cursor;
    const startLookahead = this._lookahead;

    try {
      this.#eat(tokens.OPEN_CURLY_BRACE);
      const result = this.Property();
      this.#returnCursorToPosition(startCursor, startLookahead);

      if (result.type === astTypes.Property) {
        return true;
      }
      return false;
    } catch {
      this.#returnCursorToPosition(startCursor, startLookahead);

      return false;
    }
  }

  #isLiteral(tokenType) {
    return [
      tokens.NUMBER,
      tokens.STRING,
      tokens.TRUE,
      tokens.FALSE,
      tokens.NULL,
      tokens.UNDEFINED,
      tokens.OPEN_SQUARE_BRACKET,
      tokens.OPEN_CURLY_BRACE,
    ].includes(tokenType);
  }

  #checkIfNotLookahead(tokenType) {
    return this._lookahead !== null && this._lookahead.type !== tokenType;
  }

  #checkIfLookahead(tokenType) {
    return this._lookahead !== null && this._lookahead.type === tokenType;
  }

  /**
   * Program: StatementList;
   */
  Program() {
    return factory.Program(this.StatementList());
  }

  /**
   * StatementList
   *  : Statement
   *  | StatementList Statement
   *  ;
   */
  StatementList(stopLookahead = null) {
    const statementList = [];

    while (this.#checkIfNotLookahead(stopLookahead)) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   *  Statement
   *   : ExpressionStatement
   *   | BlockStatement
   *   | EmptyStatement
   *   | VariableStatement
   *   | IfStatement
   *   | IterationStatement
   *   | FunctionDeclaration
   *   | ReturnStatement
   *   | ClassDeclaration
   *   | ImportStatement
   */
  Statement() {
    switch (this._lookahead.type) {
      case tokens.SEMICOLON:
        return this.EmptyStatement();
      case tokens.IF:
        return this.IfStatement();
      case tokens.OPEN_CURLY_BRACE:
        return this.BlockStatement();
      case tokens.LET:
        return this.VariableStatement();
      case tokens.DEF:
        return this.FunctionDeclaration();
      case tokens.RETURN:
        return this.ReturnStatement();
      case tokens.FOR:
      case tokens.WHILE:
      case tokens.DO:
      case tokens.FOREACH:
        return this.IterationStatement();
      case tokens.CLASS:
        return this.ClassDeclaration();
      case tokens.IMPORT:
        return this.ImportStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * ClassDeclaration
   *  : 'class' Identifier OptClassExtends BlockStatement
   *  ;
   */
  ClassDeclaration() {
    this.#eat(tokens.CLASS);

    const id = this.Identifier();
    const superClass =
      this._lookahead.type === tokens.EXTENDS ? this.ClassExtends() : null;

    const body = this.BlockStatement();

    return factory.ClassDeclaration(id, superClass, body);
  }

  /**
   * ClassExtends
   *  : 'extends' Identifier
   *  ;
   */
  ClassExtends() {
    this.#eat(tokens.EXTENDS);
    return this.Identifier();
  }

  /**
   * FunctionDeclaration
   *  : 'def' OptIdentifier '(' OptFormalParametersList ')' BlockStatement
   */
  FunctionDeclaration() {
    this.#eat(tokens.DEF);

    const name = this.#checkIfLookahead(tokens.IDENTIFIER)
      ? this.Identifier()
      : null;
    this.#eat(tokens.OPEN_PARENTHESIS);

    const params = this.#checkIfNotLookahead(tokens.CLOSE_PARENTHESIS)
      ? this.FormalParametersList()
      : [];

    this.#eat(tokens.CLOSE_PARENTHESIS);

    const body = this.BlockStatement();

    return factory.FunctionDeclaration(name, params, body);
  }

  /**
   * FormalParametersList
   *  : Identifier
   *  | FormalParametersList ',' Identifier
   *  ;
   */
  FormalParametersList() {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (this._lookahead.type === tokens.COMA && this.#eat(tokens.COMA));

    return params;
  }

  /**
   * ReturnStatement
   *   : 'return' OptStatement ';'
   *   ;
   *
   */
  ReturnStatement() {
    this.#eat(tokens.RETURN);
    const argument =
      this._lookahead.type !== tokens.SEMICOLON ? this.Statement() : null;

    return factory.ReturnStatement(argument);
  }

  /**
   * IterationStatement
   *   : WhileStatement
   *   | DoWhileStatement
   *   | ForStatement
   *   | ForEachStatement
   *   ;
   */
  IterationStatement() {
    switch (this._lookahead.type) {
      case tokens.WHILE:
        return this.WhileStatement();
      case tokens.DO:
        return this.DoWhileStatement();
      case tokens.FOR:
        return this.ForStatement();
      case tokens.FOREACH:
        return this.ForEachStatement();
    }
  }

  /**
   * WhileStatement
   *  : 'while' Expression  Statement
   *  ;
   */
  WhileStatement() {
    this.#eat(tokens.WHILE);

    const test = this.Expression();
    const body = this.Statement();

    return factory.WhileStatement(test, body);
  }

  /**
   * DoWhileStatement
   *   : 'do' Statement 'while' Expression ';'
   */
  DoWhileStatement() {
    this.#eat(tokens.DO);

    const body = this.Statement();
    this.#eat(tokens.WHILE);
    const test = this.Expression();
    this.#eat(tokens.SEMICOLON);

    return factory.DoWhileStatement(test, body);
  }

  /**
   * ForStatement
   *   : 'for' OptForStatementInit ';' OptExpression ';' OptExpression  Statement
   *   ;
   */
  ForStatement() {
    this.#eat(tokens.FOR);

    const init = this.#checkIfNotLookahead(tokens.SEMICOLON)
      ? this.ForStatementInit()
      : null;
    this.#eat(tokens.SEMICOLON);
    const test = this.#checkIfNotLookahead(tokens.SEMICOLON)
      ? this.Expression()
      : null;
    this.#eat(tokens.SEMICOLON);
    const update = this.#checkIfNotLookahead(tokens.SEMICOLON)
      ? this.Expression()
      : null;
    this.#eat(tokens.SEMICOLON);

    const body = this.Statement();

    return factory.ForStatement(init, test, update, body);
  }

  /**
   * ForStatementInit
   *  : VariableStatementInit
   *  | Expression
   */
  ForStatementInit() {
    if (this.#checkIfLookahead(tokens.LET)) {
      return this.VariableStatementInit();
    }

    return this.Expression();
  }

  /**
   * ForEachStatement
   *   : 'foreach' VariableDefineList in OptExpression ';' Statement
   *   ;
   */
  ForEachStatement() {
    this.#eat(tokens.FOREACH);
    const left = this.VariableInitList();
    this.#eat(tokens.IN);
    const right = this.Expression();

    const body = this.Statement();

    return factory.ForEachStatement(left, right, body);
  }

  /**
   * IfStatement
   *   : 'if' Expression Statement
   *   : 'if' Expression Statement 'else' Statement
   */
  IfStatement() {
    this.#eat(tokens.IF);

    const test = this.Expression();
    const consequent = this.Statement();
    const alternate = this.#checkIfLookahead(tokens.ELSE)
      ? this.#eat(tokens.ELSE) && this.Statement()
      : null;

    return factory.IfStatement(test, consequent, alternate);
  }

  /**
   * VariableStatementInit
   *  : 'let' VariableDeclarationList
   */
  VariableStatementInit() {
    this.#eat(tokens.LET);
    const declarations = this.VariableDeclarationList();

    return factory.VariableStatement(declarations);
  }

  /**
   * VariableStatement
   *  : 'let' VariableDeclarationList ';'
   */
  VariableStatement() {
    const variableStatement = this.VariableStatementInit();

    this.#eat(tokens.SEMICOLON);

    return variableStatement;
  }

  /**
   * VariableDeclarationList
   *  : VariableDeclaration
   *  | VariableDeclarationList ',' VariableDeclaration
   */
  VariableDeclarationList() {
    const declarations = [this.VariableDeclaration()];

    while (this.#checkIfLookahead(tokens.COMA) && this.#eat(tokens.COMA)) {
      declarations.push(this.VariableDeclaration());
    }

    return declarations;
  }

  VariableInitList() {
    const declarations = [this.VariableInit()];

    while (this.#checkIfLookahead(tokens.COMA) && this.#eat(tokens.COMA)) {
      declarations.push(this.VariableInit());
    }

    return factory.VariableStatement(declarations);
  }

  VariableInit() {
    this.#eat(tokens.LET);
    const id = this.Identifier();
    return factory.VariableDeclaration(id, null);
  }

  /**
   * VariableDeclaration
   *  : Identifier OptVariableInitializer
   */
  VariableDeclaration() {
    const id = this.Identifier();

    const init =
      this.#checkIfLookahead(tokens.COMA) ||
      this.#checkIfLookahead(tokens.SEMICOLON)
        ? null
        : this.VariableInitializer();

    return factory.VariableDeclaration(id, init);
  }

  /**
   * VariableInitializer
   *  : SIMPLE_ASSIGN AssignmentExpression
   */
  VariableInitializer() {
    this.#eat(tokens.SIMPLE_ASSIGN);

    return this.AssignmentExpression();
  }

  EmptyStatement() {
    this.#eat(tokens.SEMICOLON);

    return factory.EmptyStatement();
  }

  #routeToObjectLiteral() {
    if (this.#isObjectLiteral()) {
      return this.ObjectLiteral();
    }
    return null;
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   *  ;
   */
  BlockStatement() {
    const result = this.#routeToObjectLiteral();
    if (result) return result;

    this.#eat(tokens.OPEN_CURLY_BRACE);

    const body = this.#checkIfNotLookahead(tokens.CLOSE_CURLY_BRACE)
      ? this.StatementList(tokens.CLOSE_CURLY_BRACE)
      : [];

    this.#eat(tokens.CLOSE_CURLY_BRACE);

    return factory.BlockStatement(body);
  }

  /**
   *  ExpressionStatement: Expression
   */
  ExpressionStatement() {
    const expression = this.Expression();
    this.#eat(tokens.SEMICOLON);

    return factory.ExpressionStatement(expression);
  }

  /**
   * Expression: AssignmentExpression
   */
  Expression() {
    return this.AssignmentExpression();
  }

  /**
   * LogicalAndExpression
   *  : EqualityExpression LOGICAL_AND LogicalAndExpression
   *  | EqualityExpression
   *  ;
   */
  LogicalAndExpression() {
    return this.#binaryExpressionGenerator(
      this.EqualityExpression.bind(this),
      tokens.LOGICAL_AND,
      factory.LogicalExpression
    );
  }

  /**
   * LogicalOrExpression
   *  : LogicalAndExpression LOGICAL_OR LogicalOrExpression
   *  | LogicalOrExpression
   *  ;
   */
  LogicalOrExpression() {
    return this.#binaryExpressionGenerator(
      this.LogicalAndExpression.bind(this),
      tokens.LOGICAL_OR,
      factory.LogicalExpression
    );
  }

  /**
   *  AssignmentOperator
   *  : SIMPLE_ASSIGN
   *  | COMPLEX_ASSIGN
   */
  AssignmentOperator() {
    if (this.#checkIfLookahead(tokens.SIMPLE_ASSIGN)) {
      return this.#eat(tokens.SIMPLE_ASSIGN);
    }

    return this.#eat(tokens.COMPLEX_ASSIGN);
  }

  /**
   * EqualityExpression
   *  : RelationalExpression EQUALITY_OPERATOR EqualityExpression
   *  | RelationalExpression
   */
  EqualityExpression() {
    return this.#binaryExpressionGenerator(
      this.RelationalExpression.bind(this),
      tokens.EQUALITY_OPERATOR
    );
  }

  /**
   * RelationalExpression
   *  : AdditiveExpression
   *  | AdditiveExpression RELATIONAL_OPERATOR RelationalExpression
   */
  RelationalExpression() {
    return this.#binaryExpressionGenerator(
      this.AdditiveExpression.bind(this),
      tokens.RELATIONAL_OPERATOR
    );
  }

  /**
   * AssignmentExpression
   *  : AssignmentStatement
   *  | AssignmentStatement AssignmentOperator AssignmentExpression
   */
  AssignmentExpression() {
    const left = this.AssignmentStatement();

    if (
      this._lookahead !== null &&
      !this.#isAssignmentOperator(this._lookahead.type)
    ) {
      return left;
    }

    return factory.AssignmentExpression(
      this.AssignmentOperator().value,
      factory._checkValidAssignmentTarget(left),
      this.AssignmentExpression()
    );
  }

  AssignmentStatement() {
    switch (this._lookahead.type) {
      case tokens.IF:
        return this.IfStatement();
      case tokens.OPEN_CURLY_BRACE:
        return this.BlockStatement();
      case tokens.DEF:
        return this.FunctionDeclaration();
      case tokens.FOR:
      case tokens.WHILE:
      case tokens.DO:
      case tokens.FOREACH:
        return this.IterationStatement();
      case tokens.CLASS:
        return this.ClassDeclaration();
      default:
        return this.LogicalOrExpression();
    }
  }

  /**
   * ImportStatement
   *   : import IDENTIFIER from StringLiteral
   *   :
   */
  ImportStatement() {
    this.#eat(tokens.IMPORT);

    const id = this.Identifier();
    this.#eat(tokens.FROM);
    const path = this.StringLiteral();

    return factory.ImportStatement(id, path);
  }

  /**
   * LeftHandSideExpression
   *  : CallMemberExpression
   *  ;
   */
  LeftHandSideExpression() {
    return this.CallMemberExpression();
  }

  /**
   * CallMemberExpression
   *  : MemberExpression
   *  | CallExpression
   *  | Super
   *  ;
   */
  CallMemberExpression() {
    if (this.#checkIfLookahead(tokens.SUPER)) {
      return this._CallExpression(this.Super());
    }

    const member = this.MemberExpression();

    if (this.#checkIfLookahead(tokens.OPEN_PARENTHESIS)) {
      return this._CallExpression(member);
    }

    return member;
  }

  /**
   * CallExpression
   *  : Callee Arguments
   *  ;
   *
   *  Callee
   *   : MemberExpression
   *   | CallExpression
   *   ;
   */
  _CallExpression(callee) {
    let callExpression = factory.CallExpression(callee, this.Arguments());

    if (this._lookahead.type === tokens.OPEN_PARENTHESIS) {
      callExpression = this._CallExpression(callExpression);
    }

    return callExpression;
  }

  /**
   *  Arguments
   *   : '(' OptArgumentList ')'
   *   ;
   */
  Arguments() {
    this.#eat(tokens.OPEN_PARENTHESIS);

    const argumentList = this.#checkIfNotLookahead(tokens.CLOSE_PARENTHESIS)
      ? this.ArgumentList()
      : [];

    this.#eat(tokens.CLOSE_PARENTHESIS);

    return argumentList;
  }

  /**
   * ArgumentList
   *  : AssignmentExpression
   *  | ArgumentList ',' AssignmentExpression
   */
  ArgumentList() {
    const argumentList = [];

    do {
      argumentList.push(this.AssignmentExpression());
    } while (this._lookahead.type === tokens.COMA && this.#eat(tokens.COMA));

    return argumentList;
  }

  /**
   * MemberExpression
   *  : PrimaryExpression
   *  | MemberExpression '.' Identifier
   *  | MemberExpression '[' Expression ']'
   */
  MemberExpression() {
    let object = this.PrimaryExpression();

    while (
      this.#checkIfLookahead(tokens.DOT) ||
      this.#checkIfLookahead(tokens.OPEN_SQUARE_BRACKET)
    ) {
      if (this._lookahead.type === tokens.DOT) {
        this.#eat(tokens.DOT);
        const property = this.Identifier();
        object = factory.MemberExpression(false, object, property);
      }

      if (this._lookahead.type === tokens.OPEN_SQUARE_BRACKET) {
        const computedProperty = this.ComputedExpression();
        object = factory.MemberExpression(true, object, computedProperty);
      }
    }

    return object;
  }

  /**
   * Identifier: IDENTIFIER
   */
  Identifier() {
    const name = this.#eat(tokens.IDENTIFIER).value;
    return factory.Identifier(name);
  }

  /**
   * AdditiveExpression
   *  : MultiplicativeExpression
   *  | MultiplicativeExpression OPERATOR MultiplicativeExpression
   */
  AdditiveExpression() {
    return this.#binaryExpressionGenerator(
      this.MultiplicativeExpression.bind(this),
      tokens.ADDITIVE_OPERATOR
    );
  }

  /**
   * MultiplicativeExpression
   *  : PowExpression
   *  | MultiplicativeExpression OPERATOR PowExpression
   */
  MultiplicativeExpression() {
    return this.#binaryExpressionGenerator(
      this.PowExpression.bind(this),
      tokens.MULTIPLICATIVE_OPERATOR
    );
  }

  /**
   * PowExpression
   *  : UnaryExpression
   *  | PowExpression OPERATOR UnaryExpression
   */
  PowExpression() {
    return this.#binaryExpressionGenerator(
      this.UnaryExpression.bind(this),
      tokens.POW_OPERATOR
    );
  }

  /**
   * UnaryExpression
   *  : LeftHandSideExpression
   *  | ADDITIVE_OPERATOR UnaryExpression
   *  | LOGICAL_NOT UnaryExpression
   *  ;
   */
  UnaryExpression() {
    let operator = null;
    switch (this._lookahead.type) {
      case tokens.ADDITIVE_OPERATOR:
        operator = this.#eat(tokens.ADDITIVE_OPERATOR).value;
        break;
      case tokens.LOGICAL_NOT:
        operator = this.#eat(tokens.LOGICAL_NOT).value;
        break;
    }

    if (operator !== null) {
      return factory.UnaryExpression(operator, this.UnaryExpression());
    }

    return this.LeftHandSideExpression();
  }

  /**
   * PrimaryExpression:
   *  : Literal
   *  | ParenthesizedExpression
   *  | Identifier
   *  | ThisExpression
   *  | NewExpression
   *  ;
   */
  PrimaryExpression() {
    if (this.#isLiteral(this._lookahead.type)) {
      return this.Literal();
    }

    switch (this._lookahead.type) {
      case tokens.OPEN_PARENTHESIS:
        return this.ParenthesizedExpression();
      // case tokens.THIS:
      //   return this.ThisExpression();
      case tokens.NEW:
        return this.NewExpression();
      case tokens.IDENTIFIER:
        return this.Identifier();
    }
  }

  /**
   * ComputedExpression
   *  : '[' Expression ']'
   *  ;
   */
  ComputedExpression() {
    this.#eat(tokens.OPEN_SQUARE_BRACKET);
    const expression = this.Expression();
    this.#eat(tokens.CLOSE_SQUARE_BRACKET);

    return factory.ComputedExpression(expression);
  }

  /**
   * NewExpression
   *  : 'new' MemberExpression Arguments
   *  ;
   */
  NewExpression() {
    this.#eat(tokens.NEW);
    return factory.NewExpression(this.MemberExpression(), this.Arguments());
  }

  // /**
  //  * ThisExpression
  //  *  : 'this'
  //  *  ;
  //  */
  // ThisExpression() {
  //   this.#eat(tokens.THIS);
  //   return factory.ThisExpression();
  // }

  /**
   * Super
   *  : 'super'
   *  ;
   */
  Super() {
    this.#eat(tokens.SUPER);
    return factory.Super();
  }

  /**
   * ParenthesizedExpression
   *  : '(' Expression ')'
   */
  ParenthesizedExpression() {
    this.#eat(tokens.OPEN_PARENTHESIS);
    const expression = this.Expression();
    this.#eat(tokens.CLOSE_PARENTHESIS);

    return expression;
  }

  /**
   * Literal:
   *  : NumericLiteral
   *  | StringLiteral
   *  | BooleanLiteral
   *  | NullLiteral
   *  | UndefinedLiteral
   *  | ObjectLiteral
   *  ;
   */
  Literal() {
    switch (this._lookahead.type) {
      case tokens.NUMBER:
        return this.NumericLiteral();
      case tokens.STRING:
        return this.StringLiteral();
      case tokens.TRUE:
        return this.BooleanLiteral(true);
      case tokens.FALSE:
        return this.BooleanLiteral(false);
      case tokens.NULL:
        return this.NullLiteral();
      case tokens.OPEN_CURLY_BRACE:
        return this.ObjectLiteral();
      case tokens.OPEN_SQUARE_BRACKET:
        return this.ArrayLiteral();
      case tokens.UNDEFINED:
        return this.UndefinedLiteral();
    }

    throw new SyntaxError("Literal: unexpected literal production");
  }

  /**
   * ObjectLiteral
   *   : '{' OptPropertiesList '}'
   */
  ObjectLiteral() {
    this.#eat(tokens.OPEN_CURLY_BRACE);
    const properties = this.#checkIfNotLookahead(tokens.CLOSE_CURLY_BRACE)
      ? this.PropertiesList()
      : null;
    this.#eat(tokens.CLOSE_CURLY_BRACE);

    return factory.ObjectLiteral(properties);
  }

  /**
   * ArrayLiteral
   *  : '[' OptLiteralList ']'
   */
  ArrayLiteral() {
    this.#eat(tokens.OPEN_SQUARE_BRACKET);

    const literalList = this.#checkIfNotLookahead(tokens.CLOSE_SQUARE_BRACKET)
      ? this.ExpressionList()
      : [];

    this.#eat(tokens.CLOSE_SQUARE_BRACKET);

    return factory.ArrayLiteral(literalList);
  }

  /**
   * ExpressionList
   *  : ExpressionList LogicalOrExpression
   *  | LogicalOrExpression
   *  ;
   */
  ExpressionList() {
    const literalList = [];

    do {
      literalList.push(this.LogicalOrExpression());
    } while (this.#checkIfLookahead(tokens.COMA) && this.#eat(tokens.COMA));

    return literalList;
  }

  /**
   * PropertiesList
   *   : Property
   *   | PropertiesList Property
   */
  PropertiesList() {
    const propertyList = [];

    while (this.#checkIfNotLookahead(tokens.CLOSE_CURLY_BRACE)) {
      propertyList.push(this.Property());
      if (this.#checkIfNotLookahead(tokens.CLOSE_CURLY_BRACE)) {
        this.#eat(tokens.COMA);
      }
    }

    return propertyList;
  }

  /**
   * Property
   *  : IDENTIFIER':' Literal
   *  | ComputedExpression':' Literal
   */
  Property() {
    const name = this.#checkIfLookahead(tokens.OPEN_SQUARE_BRACKET)
      ? this.ComputedExpression()
      : this.Identifier();
    this.#eat(tokens.COLON);
    const value = this.Literal();

    return factory.Property(name, value);
  }

  /**
   * BooleanLiteral
   *  : 'true'
   *  | 'false'
   *  ;
   */
  BooleanLiteral(value) {
    this.#eat(value ? tokens.TRUE : tokens.FALSE);
    return factory.BooleanLiteral(value);
  }

  /**
   * NullLiteral
   *  : 'null'
   *  ;
   */
  NullLiteral() {
    this.#eat(tokens.NULL);
    return factory.NullLiteral(null);
  }

  /**
   * UndefinedLiteral
   *  : 'undefined'
   *  ;
   */
  UndefinedLiteral() {
    this.#eat(tokens.UNDEFINED);
    return factory.UndefinedLiteral(undefined);
  }

  /**
   * StringLiteral: STRING;
   */
  StringLiteral() {
    const token = this.#eat(tokens.STRING);
    return factory.StringLiteral(token.value.slice(1, -1));
  }

  /**
   *  NumericLiteral: NUMBER;
   */
  NumericLiteral() {
    const token = this.#eat(tokens.NUMBER);
    return factory.NumericLiteral(Number(token.value));
  }
}

export default Parser;
