/**
 * **TypeJS** Ver 0.0.1
 * 
 * A library for checking types in Javascript.
 * 
 * **Example**
 * ```javascript
 * TypeJS.inspect("str", String) // -> true
 * TypeJS.inspect([0, 1], Array(Number)) // -> true
 * TypeJS.inspect({ tmp: undefined }, { tmp: [String, undefined] }) // -> true
 * 
 * const nullableString = TypeJS.define([String, null]);
 * nullableString("abc") // -> "abc"
 * nullableString(null) // -> null
 * nullableString(100) // throw Error
 * ```
 */
export const TypeJS = Object.freeze({
    /**
     * Perform type validation.
     * @param {*} input Value whose type is to be checked.
     * @param {*} type Type definition.
     * @returns {boolean} whether the type matches.
     */
    inspect: function (input, type) {
        const INPUT = input;
        const isDefine = Boolean(this.isDefine);
        const ErrorLog = (message)=>{
            const TypeError = new Error();
            TypeError.name = "Type Error";
            TypeError.message = message;
            if(TypeError.stack) {
                const error_stack = TypeError.stack.split(/\n/g);
                error_stack.splice(1, isDefine?5:4);
                TypeError.stack = error_stack.join('\n');
            }
            console.error(TypeError);
        }
        const OK = (isInternalCheck = false) => isInternalCheck || (isDefine ? input : true);
        const ThrowError = (message, isInternalCheck = false) => isInternalCheck ? false : (isDefine ? (ErrorLog(message) || input) : false);
        const CheckType = (input, type, isInternalCheck = false, isArrayCheck = false) => {

            const input_typename = toString.call(input).slice(0, -1).slice(8);
            const typename = toString.call(type).slice(0, -1).slice(8);

            if (typename === "Function" && !["Boolean", "Number", "BigInt", "String", "Symbol", "Array", "Object"].includes(type.name)) {
                if (input_typename === "Function") {

                    // Function
                    if (type.name === "Function") return OK(isInternalCheck);

                    // Class
                    else if (input.name === type.name) return OK(isInternalCheck);
                    return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);

                } else if(input_typename === "Object") {

                    // Instance
                    if(input instanceof type) return OK(isInternalCheck);
                    return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
                }
                return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
            }

            //{ [key: any]: Type }
            if (typename === "Object") {
                if (input_typename === "Object") {
                    const input_keys = Object.keys(input);
                    for (let key in type) {
                        const key_index = input_keys.indexOf(key);
                        if (0 <= key_index) {
                            input_keys.splice(key_index, 1);
                            if (!CheckType(input[key], type[key], true)) return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
                        } else {
                            return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
                        }
                    }
                    if (input_keys.length) {
                        return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
                    }
                    return OK(isInternalCheck)
                }
            }

            if (type instanceof Array) {

                if (isArrayCheck) return ThrowError(`There is an error in the type definition.`, isInternalCheck);

                if (input instanceof Array) {
                    if (type.length === 0) return ThrowError(`There is an error in the type definition.`, isInternalCheck);
                    else if (type.length === 1) { // Array(Type)
                        for (const array_item of input) {
                            if (!CheckType(array_item, type[0], true)) return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
                        }
                        return OK(isInternalCheck);
                    } else { // Union
                        for (const type_item of type) {
                            if (CheckType(input, type_item, true)) return OK(isInternalCheck);
                        }
                        return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
                    }
                }

                // Union
                for (const _type of type) {
                    if (CheckType(input, _type, true, true)) return OK(isInternalCheck);
                }
                return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
            }

            // undefined
            if (typeof type === "undefined") {
                return (input_typename === "Undefined") ? OK(isInternalCheck) : ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
            }

            // null
            if (typename === "Null") {
                return (input_typename === "Null") ? OK(isInternalCheck) : ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
            }

            // Boolean, Number, BigInt, String, Symbol, Array, Object
            if (input_typename !== type.name) return ThrowError(`${JSON.stringify(INPUT)} is different from the defined type.`, isInternalCheck);
            return OK(isInternalCheck);
        }
        return CheckType(input, type);
    },
    /**
     * Type definition.
     * @param {*} type Boolean, Number, BigInt, String, Symbol, Array, Object, Function, Typeof Class, null, undefined, Union[Type1, Type2], { [key: any]: Type }
     * @returns Function of type inspection.
     */
    define: function (type) {
        const TYPE = Object.freeze(type);
        return (input) => TypeJS.inspect.bind({ isDefine: true })(input, TYPE, true);
    }
});