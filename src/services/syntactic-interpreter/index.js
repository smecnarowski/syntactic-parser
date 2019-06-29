// eslint-disable-next-line
import Tokens from './../tokens-extractor/Tokens'
import _ from 'lodash'

class SyntacticInterpreter {
    constructor(tokens) {
        this.tokens = tokens
        this.result = this.isValid([...tokens])
    }

    isValid(tokens) {
        if (this.isExpression([...tokens])) {
            return true
        }
        if (this.isTerm([...tokens])) {
            return true
        }
        if (this.isFactor([...tokens])) {
            return true
        }

        return false
    }

    isExpression(tokens) {
        const validOperators = ['+', '-']
        let operatorPosition = 0
        do {
            operatorPosition = _.findIndex(tokens, { token: 'Operator'}, operatorPosition)
            
            if (operatorPosition !== -1 && validOperators.indexOf(tokens[operatorPosition].value) !== -1) {
                let result = this.isExpression(tokens.slice(0, operatorPosition)) && this.isTerm(tokens.slice(operatorPosition + 1))
                if (result) {
                    return true
                }
            }
            if (operatorPosition !== -1) {
                operatorPosition++
            }
        } while (operatorPosition !== -1)

        return this.isTerm([...tokens]);
    }

    isTerm(tokens) {
        const validOperators = ['*', '/']
        let operatorPosition = 0
        do {
            operatorPosition = _.findIndex(tokens, { token: 'Operator'}, operatorPosition)
            
            if (operatorPosition !== -1 && validOperators.indexOf(tokens[operatorPosition].value) !== -1) {
                let result = this.isTerm(tokens.slice(0, operatorPosition)) && this.isFactor(tokens.slice(operatorPosition + 1))
                if (result) {
                    return true
                }
            }
            if (operatorPosition !== -1) {
                operatorPosition++
            }
        } while (operatorPosition !== -1)

        return this.isFactor([...tokens]);
    }

    isFactor(tokens) {
        switch (true) {
            case tokens.length === 1: {
                const validTokens = ['Decimal', 'Integer', 'Identify']
                return validTokens.indexOf(tokens[0].token) !== -1
            }

            case tokens.length > 2: {
                const first = tokens[0]
                const last = tokens[tokens.length -1]
                if (first.token === 'Bracket' && first.value === '(' && last.token === 'Bracket' && last.value === ')') {
                    return this.isExpression(tokens.slice(1, -1))
                }
                return false
            }

            default: 
                return false
        }
    }
}

export default SyntacticInterpreter
