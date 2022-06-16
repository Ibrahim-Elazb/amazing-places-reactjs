const REQUIRED_TYPE = "REQUIRED";
const MIN_LENGTH_TYPE = "MIN_LENGTH";
const MAX_LENGTH_TYPE = "MAX_LENGTH";
const MIN_TYPE = "MIN";
const MAX_TYPE = "MAX";
const EMAIL_TYPE = "EMAIL";
const PASSWORD_TYPE="PASSWORD";
// const FILE_TYPE = "FILE";

export const VALIDATOR_REQUIRED = () => ({ type: REQUIRED_TYPE })
export const VALIDATOR_MIN_LENGTH = (val) => ({ type: MIN_LENGTH_TYPE, value: val })
export const VALIDATOR_MAX_LENGTH = (val) => ({ type: MAX_LENGTH_TYPE, value: val })
export const VALIDATOR_MIN = (val) => ({ type: MIN_TYPE, value: val })
export const VALIDATOR_MAX = (val) => ({ type: MAX_TYPE, value: val })
export const VALIDATOR_EMAIL = () => ({ type: EMAIL_TYPE })
export const VALIDATOR_PASSWORD = () => ({ type: PASSWORD_TYPE })
// export const VALIDATOR_FILE = () => ({ type: FILE_TYPE })


const validator = (inputValue, validators) => {
    let isValid = true;
    for (const validation of validators) {
        if (validation.type.toString() === REQUIRED_TYPE.toString()) {
            isValid = isValid && inputValue.trim().length > 0;
        } else if (validation.type.toString() === EMAIL_TYPE.toString()) {
            // eslint-disable-next-line no-useless-escape
            isValid = isValid && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputValue);
        } else if (validation.type.toString() === MAX_LENGTH_TYPE.toString()) {
            isValid = isValid && inputValue.trim().length <= +validation.value;
        } else if (validation.type.toString() === MIN_LENGTH_TYPE.toString()) {
            isValid = isValid && inputValue.trim().length >= +validation.value;
        } else if (validation.type.toString() === MAX_TYPE.toString()) {
            isValid = isValid && !isNaN(inputValue) && +inputValue <= +validation.value;
        } else if (validation.type.toString() === MIN_TYPE.toString()) {
            isValid = isValid && !isNaN(inputValue) && +inputValue >= +validation.value;
        } else if(validation.type.toString() === PASSWORD_TYPE.toString()){
            isValid = isValid &&/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(inputValue);
        }
    }
    return isValid;
}

export default validator;