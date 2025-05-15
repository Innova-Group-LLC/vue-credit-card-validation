import { default as cardFormatUtils } from './utils.js';

const validation = {

    cardExpiryVal: function (value) {
        let [month, year] = Array.from(value.split(/[\s\/]+/, 2));

        // Allow for year shortcut
        if (((year != null ? year.length : undefined) === 2) && /^\d+$/.test(year)) {
            let prefix = (new Date).getFullYear();
            prefix = prefix.toString().slice(0, 2);
            year = prefix + year;
        }

        month = parseInt(month, 10);
        year = parseInt(year, 10);

        return { month, year };
    },

    cardHolderVal: function (value) {
        const parts = value.split(" ");
        const name = parts[0];
        const surname = parts[1];
        const args = parts.slice(2);

        return { name, surname, args };
    },

    validateCardNumber: function (num) {
        num = (num + '').replace(/\s+|-/g, '');
        if (!/^\d+$/.test(num)) { return false; }

        let card = cardFormatUtils.cardFromNumber(num);
        if (!card) { return false; }

        return Array.from(card.length).includes(num.length) &&
            ((card.luhn === false) || cardFormatUtils.luhnCheck(num));
    },

    validateCardExpiry: function (month, year) {

        if(!month){
            return false;
        }

        if(!year){
            ({ month, year } = validation.cardExpiryVal(month));
        }

        // Allow passing an object
        if ((typeof month === 'object') && 'month' in month) {
            ({ month, year } = month);
        }

        if (!month || !year) { return false; }

        month = month.toString().trim();
        year = year.toString().trim();

        if (!/^\d+$/.test(month)) { return false; }
        if (!/^\d+$/.test(year)) { return false; }
        if (!(1 <= month && month <= 12)) { return false; }

        if (year.length !== 4) { return false;}

        return true;
    },

    validateCardCVC: function (cvc, type) {
        if(!cvc){
            return false;
        }
        cvc = cvc.toString().trim();
        if (!/^\d+$/.test(cvc)) { return false; }

        let card = cardFormatUtils.cardFromType(type);
        if (card != null) {
            // Check against a explicit card type
            return Array.from(card.cvcLength).includes(cvc.length);
        } else {
            // Check against all types
            return cvc.length === 3;
        }
    },

    validateCardHolder: function (name, surname, args) {
        if(!name){
            return false;
        }

        name = name.toString().trim();
        if (!/^[A-Za-z\s]+$/.test(name)) { return false; }

        if(!surname){
            ({ name, surname, args } = validation.cardHolderVal(name));
        }

        // Allow passing an object
        if ((typeof name === 'object') && 'name' in name) {
            ({ name, surname, args } = name);
        }
        if (!surname) { return false;}

        return !!(name.length && surname.length && !args.length);
    },

    cardType: function (num) {
        if (!num) { return null; }
        return cardFormatUtils.__guard__(cardFormatUtils.cardFromNumber(num), x => x.type) || null;
    },

    formatCardNumber: function (num) {

        num = num.toString().replace(/\D/g, '');
        let card = cardFormatUtils.cardFromNumber(num);
        if (!card) { return num; }

        let upperLength = card.length[card.length.length - 1];
        num = num.slice(0, upperLength);

        if (card.format.global) {
            return cardFormatUtils.__guard__(num.match(card.format), x => x.join(' '));
        } else {
            let groups = card.format.exec(num);
            if (groups == null) { return; }
            groups.shift();
            // @TODO: Change to native filter()
            //groups = grep(groups, n => n); // Filter empty groups
            return groups.join(' ');
        }
    },

    formatExpiry: function (expiry) {
        let parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,2})?/);
        if (!parts) { return ''; }

        let mon = parts[1] || '';
        let sep = parts[2] || '';
        let year = parts[3] || '';

        if (year.length > 0) {
            sep = ' / ';

        } else if (sep === ' /') {
            mon = mon.substring(0, 1);
            sep = '';

        } else if ((mon.length === 2) || (sep.length > 0)) {
            sep = ' / ';

        } else if ((mon.length === 1) && !['0', '1'].includes(mon)) {
            mon = `0${mon}`;
            sep = ' / ';
        }

        return mon + sep + year;
    },

    formatCardHolder: function (cardholder) {
        let formattedHolder = '';
        formattedHolder = cardholder.replace(/^\s+/g, '');
        if (/^[A-Za-z]+\s+[A-Za-z]+(\s*)$/.test(formattedHolder)) {
            // Если да, то заменяем последовательность пробелов на один
            formattedHolder = formattedHolder.replace(/\s+/g, ' ');
            formattedHolder = formattedHolder.trim();
        }
        formattedHolder = formattedHolder.replace(/\s+(?=\s*$)/, ' ');


        return formattedHolder;
    }
};

export default validation;