const payment_method_json = require('./payment_methods.json');
const Client = require('../../../base/client');
const State = require('../../../../_common/storage').State;
const BinarySocket = require('../../../base/socket');
const isEuCountry = require('../../../common/country_base').isEuCountry;
const urlParam            = require('../../../../_common/url').param;

const isParamEuCountry = (param_country)=>{
    const eu_countries = ['it','de','fr','lu','gr', 'mf', 'es', 'sk', 'lt', 'nl', 'at', 'bg', 'si', 'cy', 'be', 'ro', 'hr', 'pt', 'pl', 'lv',  'ee', 'cz',  'fi',  'hu',  'dk',  'se','ie', 'im', 'gb', 'mt'];
    return eu_countries.includes(param_country);
};

const filterItem = (item, current_client_country) => {
    if (item.countries.included.length) {
        const includedCountries = item.countries.included.map(country => country.toLowerCase());
        if (includedCountries.includes(current_client_country)) {
            return true;
        } else if (includedCountries.includes('eu')) {
            if (urlParam('country')) return isParamEuCountry(current_client_country);
            return isEuCountry();
        }
        return false;

    } else if (item.countries.excluded.length) {
       
        const excludedCountries = item.countries.excluded.map(country => country.toLowerCase());
        if (excludedCountries.includes(current_client_country)) {
            return false;
        } else if (excludedCountries.includes('eu')) {
            if (urlParam('country')) return !isParamEuCountry(current_client_country);
            return !isEuCountry();
        }
        return true;

    }
    return true;
};

const showPaymentData = () => {
    let current_client_country = '';

    BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
        current_client_country = urlParam('country') || Client.get('residence') || State.getResponse('website_status.clients_country');
        // eslint-disable-next-line no-console
        console.log(current_client_country);
       
        payment_method_json.map(item => {
            const showItem = filterItem(item, current_client_country);
            if (!showItem) {
                $(`tr[data-anchor='${item.key}']`).remove();
                $('#payment_methods > div').each(function () {
                    const rowContents = $(this).find('tbody').html();
                    if (!rowContents) {
                        $(this).remove();
                    }
                });
            }
            $('#payment_methods_loading').remove();

            if (!$('#payment_methods').children().length) {
                $('#no_payment_methods').setVisibility(1);
            } else {
                $('#payment_methods').setVisibility(1);
                $('#payments_footer').setVisibility(1);
            }
        }
        );
    });
};

export default showPaymentData;
