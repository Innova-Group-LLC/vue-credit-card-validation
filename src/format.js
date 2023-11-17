import { default as cardFormatUtils } from './utils.js';
import { default as validation } from './validation.js';

const format = {

    validateCardNumber: validation.validateCardNumber,
    validateCardCVC: validation.validateCardCVC,
    validateCardExpiry: validation.validateCardExpiry,
    validateCardHolder: validation.validateCardHolder,
    
    setCardType: function(el) {
        cardFormatUtils.setCardType(el);
        setTimeout(function(){
            el.currentTarget.dispatchEvent(new Event('keyup'));
            el.currentTarget.dispatchEvent(new Event('change'));
        }, 100);
    },

    formatCardCVC: function (el) {
        el.addEventListener('keypress', cardFormatUtils.restrictNumeric);
        el.addEventListener('keypress', cardFormatUtils.restrictCVC);
        el.addEventListener('paste', cardFormatUtils.reFormatCVC);
        el.addEventListener('change', cardFormatUtils.reFormatCVC);
        el.addEventListener('input', cardFormatUtils.reFormatCVC);
        return this;
    },

    formatCardHolder: function (el) {
        el.addEventListener('keypress', cardFormatUtils.restrictLatin);
        el.addEventListener('keypress', cardFormatUtils.restrictCardHolder);
        el.addEventListener('paste', cardFormatUtils.reFormatCardHolder);
        el.addEventListener('change', cardFormatUtils.reFormatCardHolder);
        el.addEventListener('input', cardFormatUtils.reFormatCardHolder);
        return this;
    },

    formatCardExpiry: function (el) {
        cardFormatUtils.handleExpiryAttributes(el);
        el.addEventListener('keypress', cardFormatUtils.restrictNumeric);
        el.addEventListener('keypress', cardFormatUtils.formatExpiry);
        el.addEventListener('keypress', cardFormatUtils.formatForwardSlashAndSpace);
        el.addEventListener('keypress', cardFormatUtils.formatForwardExpiry);
        el.addEventListener('keydown', cardFormatUtils.formatBackExpiry);
        el.addEventListener('change', cardFormatUtils.reFormatExpiry);
        el.addEventListener('input', cardFormatUtils.reFormatExpiry);
        el.addEventListener('blur', cardFormatUtils.reFormatExpiry);
        return this;
    },

    formatCardNumber: function (el) {
        el.maxLength = 19;
        el.addEventListener('keypress', cardFormatUtils.restrictNumeric);
        el.addEventListener('keypress', cardFormatUtils.restrictCardNumber);
        el.addEventListener('keypress', cardFormatUtils.formatCardNumber);
        el.addEventListener('keydown', cardFormatUtils.formatBackCardNumber);
        el.addEventListener('keyup', cardFormatUtils.setCardType);
        el.addEventListener('paste', cardFormatUtils.reFormatCardNumber);
        el.addEventListener('change', cardFormatUtils.reFormatCardNumber);
        el.addEventListener('input', cardFormatUtils.reFormatCardNumber);
        el.addEventListener('input', cardFormatUtils.setCardType);
        return this;
    },

    restrictNumeric: function (el) {
        el.addEventListener('keypress', cardFormatUtils.restrictNumeric);
        el.addEventListener('paste', cardFormatUtils.restrictNumeric);
        el.addEventListener('change', cardFormatUtils.restrictNumeric);
        el.addEventListener('input', cardFormatUtils.restrictNumeric);
        return this;
    },

    restrictLatin: function (el) {
        el.addEventListener('keypress', cardFormatUtils.restrictLatin);
        el.addEventListener('paste', cardFormatUtils.restrictLatin);
        el.addEventListener('change', cardFormatUtils.restrictLatin);
        el.addEventListener('input', cardFormatUtils.restrictLatin);
        return this;
    }
}

export default format;