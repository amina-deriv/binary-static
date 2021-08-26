const Client           = require('../../../base/client');
const State            = require('../../../../_common/storage').State;
const payment_method_json = require ('./payment_methods.json');
const BinarySocket     = require('../../../base/socket');
const isEuCountry      = require('../../../common/country_base').isEuCountry;


const CategorizePaymentMethod = (json) => {
    const categories = {};
    json.map((data) => {
        const { category } = data
        if (categories[category] === undefined) {
            categories[category] = [];
        }
        delete data.category;
        categories[category].push({ ...data });
    })
    return categories;
}

const getsortedCategories = (categories) => {
    const sorted_categories = [];
    const default_order = ['Banking', 'Credit', 'wallet', 'Crypto', 'Fiat'];
    categories.map((category) => {
        default_order.forEach((order, index) => {
            if (category.includes(order)) {
                sorted_categories[index] = category
            }
        })
    })
    return sorted_categories;
}


const PaymentDataGenerator = () => {
    const categorized_payment_methods = CategorizePaymentMethod(payment_method_json)
    const sortedCategories = getsortedCategories(Object.keys(categorized_payment_methods))
    return sortedCategories.map((category) => {
        const payment_methods = categorized_payment_methods[category];
        const data = payment_methods && payment_methods.map(item =>  ({...item}));
        return {
            name: category,
            data
        }
    })
}
const filterPaymentMethods= (payment_data) => {
    console.log(payment_data);
    let current_client_country = '';
     BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            //  current_client_country = Client.get('residence') || State.getResponse('website_status.clients_country');
             current_client_country = 'af'
             console.log(current_client_country);
             const payments_data_array = payment_data.map((category) => {
                const filteredData = category.data.filter((item) => {
                    if (item.countries.included.length) {
                        const includedCountries = item.countries.included.map((i) => i.toLowerCase())
                        if (includedCountries.includes(current_client_country)) {
                            return true
                        }
                        if (includedCountries.includes('eu')) {
                            return isEuCountry(current_client_country)
                        }
                    }
                    if (item.countries.excluded.length) {
                        const excludedCountries = item.countries.excluded.map((i) => i.toLowerCase())
                        if (excludedCountries.includes(current_client_country)) {
                            return false
                        }
                        if (excludedCountries.includes('eu')) {
                            return !isEuCountry(current_client_country)
                        }
                    } else {
                        return false
                    }
                    return true
                })
                return {
                    ...category,
                    data: filteredData,
                }
            })
           const payment_list = payments_data_array.filter((item) => item.data.length)
            console.log(payment_list);
            return payment_list
              
     })
    }


    const getFilteredData=()=>{
        const payment_data = PaymentDataGenerator();
        console.log(filterPaymentMethods(payment_data));
        return filterPaymentMethods(payment_data);  
    } 

  const payment_data=  getFilteredData();


export default payment_data;
