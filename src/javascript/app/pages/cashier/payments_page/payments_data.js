const payment_method_json = require('./payment_methods.json');
const Client = require('../../../base/client');
const State = require('../../../../_common/storage').State;
const BinarySocket = require('../../../base/socket');
const isEuCountrySelected = require('../../../../_common/utility').isEuCountrySelected;

const filterCountry = (countriesArray, client_country) => {
    const countries = countriesArray.map((i) => i.toLowerCase());
    if (countries.includes(client_country)) {
        return true;
    } else if (countries.includes('eu')) {
        return isEuCountrySelected(client_country);
    }
    return false;
};

const getPaymentsBasedOnCountry = (item, client_country) => {
    if (item.countries.included.length) {
        return filterCountry(item.countries.included, client_country);
    } else if (item.countries.excluded.length) {
        return !filterCountry(item.countries.excluded, client_country);
    } return true;
};

const showPaymentData = () => {
    let current_client_country = '';

    BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
        const client_country = Client.get('residence') || State.getResponse('website_status.clients_country');
        current_client_country = client_country.toLowerCase();
        payment_method_json.map(item => {
            const showItem = getPaymentsBasedOnCountry(item, current_client_country);
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
