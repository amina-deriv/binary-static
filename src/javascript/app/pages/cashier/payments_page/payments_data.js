const payment_method_json = require('./payment_methods.json');
const Client = require('../../../base/client');
const State = require('../../../../_common/storage').State;
const BinarySocket = require('../../../base/socket');
const isEuCountry = require('../../../common/country_base').isEuCountry;

const filterItem = (item, current_client_country) => {
    if (item.countries.included.length) {
        
        const includedCountries = item.countries.included.map(country => country.toLowerCase());
        if (includedCountries.includes(current_client_country)) {
            return true;
        } else if (includedCountries.includes('eu')) {
            return isEuCountry();
        }
        return false;

    } else if (item.countries.excluded.length) {
       
        const excludedCountries = item.countries.excluded.map(country => country.toLowerCase());
        if (excludedCountries.includes(current_client_country)) {
            return false;
        } else if (excludedCountries.includes('eu')) {
            return !isEuCountry();
        }
        return true;

    }
    return true;
};

const showPaymentData = () => {
    let current_client_country = '';

    BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
        current_client_country = Client.get('residence') || State.getResponse('website_status.clients_country');
        setTimeout(() => {
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
              
                if (!$('#payment_methods').children().length){
                    $('#no_payment_methods').setVisibility(1);
                } else {
                    $('#payment_methods').setVisibility(1);
                    $('#payments_footer').setVisibility(1);
                }
            }, 5);

        }
        );
    });
};

export default showPaymentData;
