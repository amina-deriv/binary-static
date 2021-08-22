import React from 'react';
import fs from  'fs';
// import Client from '../../../javascript/app/base/client';
import { CashierNote } from './index.jsx';
import { Table } from '../../_common/components/elements.jsx';
import payment_method_json from './payment_methods.json'


const Button = ({ url, real, className, text }) => (
    <a href={it.url_for(url)} className={`toggle button ${real ? 'client_real' : 'client_logged_out'} invisible ${className || undefined}`}>
        <span>{text}</span>
    </a>
);

const TableTitle = ({ title, className, dataShow, dataAnchor }) => (
    <h3 className={`gr-padding-10${className ? ` ${className}` : ''}`} data-show={dataShow} data-anchor={dataAnchor}>{title}</h3>
);



const PaymentLogo = ({ logo, name }) => {
    const logoFilePath = `src/images/pages/home/payment/${logo}.svg`;
    if (fs.existsSync(logoFilePath)) {
        return <img src={it.url_for(`images/pages/home/payment/${logo}.svg`)} />
    } else {
        return <div className='payment-methods__noIconText'>{`${name}`}</div>

    }
};

const TableValues = ({ value }) => {
    const values = Array.isArray(value) ? value : [value];
    return (
        <React.Fragment>
            { values.reduce((arr, e, inx) => arr === null ? [e] : [...arr, <br key={inx} />, e], null) }
        </React.Fragment>
    );
};

const ReferenceLink = ({ href, className = '', title = '' }) => (
    <a
        className={`payment-methods__reference ${className}`}
        href={href}
        target='_blank'
        aria-disabled={!href}
        title={title}
        rel='noopener noreferrer'
    />
);

const ReferenceLinks = ({ pdf_file, video_link }) => (
    <React.Fragment>
        {!pdf_file && !video_link && <span>&mdash;</span>}
        {pdf_file && <ReferenceLink
            className='payment-methods__reference-pdf'
            href={pdf_file && it.url_for(`download/payment/${pdf_file}`)}
            title={pdf_file}
        />}
        {video_link && <ReferenceLink
            className='payment-methods__reference-video'
            href={video_link}
            title={it.L('Video tutorial')}
        />}
    </React.Fragment>
);

const CustomTableHead = ({ data }) => (
    <React.Fragment>
        {data.map((item, index) => (
            <span key={index} className='th'>{item.text}</span>
        ))}
    </React.Fragment>
);

const CustomTableData = ({ data }) => (
    <React.Fragment>
        {data.map((item, index) => (
            <div key={index} className={item.td ? 'td-description' : 'td-list active'}>
                {item.td && <span className='td'>{item.td}</span>}
                {item.td_list &&
                    item.td_list.map((td, inx_td) => (
                        <p className='td' key={inx_td}>{td.text}</p>
                    ))
                }
            </div>
        ))}
    </React.Fragment>
);


    const CategorizePaymentMethod = (json) => {
        const categories = {}
        json.map((data) => {
           
            const { category, platform } = data
            if (categories[category] === undefined) {
                categories[category] = []
            }
    
            delete data.category
    
            const show_method =
                (platform && platform.toLowerCase().includes('binary')) || platform === ''
    
            if (show_method) {
                categories[category].push({ ...data })
            } else {
                delete categories[category]
            }
        })
    
        return categories
    }
    
    const getsortedCategories = (categories) => {
        const final_categories = []
        const default_order = ['Banking', 'Credit', 'wallet', 'Crypto', 'Fiat']
    
        categories.map((category) => {
            default_order.forEach((order, index) => {
                if (category.includes(order)) {
                    final_categories[index] = category
                }
            })
        })
    
        return final_categories
    }
   
     
        const getDepositLimit = (min_deposit, max_deposit) => {
            if (min_deposit === 'Not Available' && max_deposit === 'Not Available')
                return ('-') 
            if (min_deposit.includes('|') && max_deposit.includes('|')) {
                let min_deposit_array = min_deposit.split('|')
                let max_deposit_array = max_deposit.split('|')
                return (
                    // <Localize
                    //     translate_text={`${min_deposit_array[0]} - ${max_deposit_array[0]} <0></0>${min_deposit_array[1]} - ${max_deposit_array[1]}  `}
                    //     components={[<br key={0} />]}
                    // />
                    it.L(`${min_deposit_array[0]} - ${max_deposit_array[0]} <0></0>${min_deposit_array[1]} - ${max_deposit_array[1]}`) 
                )
            }
            return  it.L(`${min_deposit} - ${max_deposit}`)
        }

        const getWithdrawalLimit = (min_withdrawal, max_withdrawal) => {
            if (max_withdrawal === 'Not Available') 
                return it.L(`${min_withdrawal}`)
            if (min_withdrawal.includes('|') && max_withdrawal.includes('|')) {
                let min_withdrawal_array = min_withdrawal.split('|')
                let max_withdrawal_array = max_withdrawal.split('|')
                return (
                    it.L(`${min_withdrawal_array[0]} - ${max_withdrawal_array[0]} <0></0>${min_withdrawal_array[1]} - ${max_withdrawal_array[1]}`) 
                )
            }
            return it.L(`${min_withdrawal} - ${max_withdrawal}`)
        }

        const getCurrency = (currencies) => {
            if (currencies.length != 2) return currencies[0].join(' ')
            else return `${currencies[0].join(' ')}\n${currencies[1].join(' ')}`
        }

        const getProcessingTime = (deposit_time, withdrawal_time) => {
            const deposit = 'Deposit: ';
            const withdrawal = 'Withdrawal: ';
            return (<TableValues value={[it.L(`${deposit}${deposit_time}`), it.L(`${withdrawal}${withdrawal_time}`)]} /> )
        }
        // const getClientCountry = () => {
        //     let current_client_country = Client.get('residence')|| State.getResponse('website_status.clients_country');
        //     return current_client_country
        // }

const getTableHead = (categoryName) => {
    let is_crypto=false;
   if (categoryName.includes('Crypto')) is_crypto=true; 
    
      return  ([[
            { text: it.L('Method') },
            {
                attributes: { colSpan: 5, className: 'th-list' }, custom_th: <CustomTableHead data={[
                    { text: it.L('Currencies') },
                    { text: is_crypto?`${ it.L('Min Deposit')}`:`${ it.L('Min-Max Deposit')}`},
                    { text: is_crypto?`${ it.L('Min Withdrawal')}`:`${  it.L('Min-Max Withdrawal')}`},
                    { text: `${it.L('Processing Time')}*` },
                    { text: it.L('Reference') },
                ]}
                />,
            },
        ]])
}

const getTableBody =(data=> data.map(item=>{
        return   {
            id : `${item.name}`,
            row: [
                { text: <PaymentLogo logo= {`${item.logo}`} name={`${item.name}`} /> },
                { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                    { td: it.L( `${item.description}`) },
                    { td_list: [
                        { text: getCurrency(item.currencies) },
                        { text: getDepositLimit(item.min_deposit,item.max_deposit) },
                        { text: getWithdrawalLimit(item.min_withdrawal,item.max_withdrawal) },
                        { text: getProcessingTime(item.deposit_time,item.withdrawal_time) },
                        
                    ],
                    },
                ]}
                />,
                },
            ],
        }
    })
)
// const is_uk_residence = (Client.get('residence') === 'gb' || State.getResponse('website_status.clients_country') === 'gb');






    const PaymentDataGenerator = () => {
        const categorized_method = CategorizePaymentMethod(payment_method_json)
        const sortedCategories = getsortedCategories(Object.keys(categorized_method))
        return sortedCategories.map((category) => {
            const payment_methods = categorized_method[category]
            const data =
                payment_methods &&
                payment_methods.map(
                    ({
                        currencies,
                        deposit_proccessing_time,
                        description,
                        logo,
                        name,
                        max_deposit,
                        min_deposit,
                        max_withdrawal,
                        min_withdrawal,
                        withdrawal_processing_time,
                        link_deriv,
                        reference,
                        key,
                        countries,
                        locale,
                    }) => {
                       
                        // const payment_method_logo = PaymentLogos[logo] ? (
                        //     <StyledIcon src={PaymentLogos[logo]} alt={name} />
                        // ) : (
                        //     <NoIconText>{name}</NoIconText>
                        // )
                        // return {
                        //     name,
                        //     method: payment_method_logo,
                        //     currencies: getCurrency(currencies),
                        //     min_max_deposit: getDepositLimit(min_deposit, max_deposit),
                        //     min_max_withdrawal: getWithdrawalLimit(min_withdrawal, max_withdrawal),
                        //     deposit_time: <Localize translate_text={deposit_proccessing_time} />,
                        //     withdrawal_time: <Localize translate_text={withdrawal_processing_time} />,
                        //     description: <Localize translate_text={description} />,
                        //     countries,
                        //     ...(reference !== '' && { reference: `${key}-payment-method.pdf` }),
                        //     ...(link_deriv !== '' && { url: link_deriv }),
                        //     ...(locale.length && { locales: locale }),
                        // }

                        return {
                                name,
                                // method: payment_method_logo,
                                currencies: currencies,
                                min_deposit: min_deposit,
                                max_deposit:max_deposit,
                                min_withdrawal: min_withdrawal, 
                                max_withdrawal:max_withdrawal,
                                deposit_time: deposit_proccessing_time,
                                withdrawal_time:withdrawal_processing_time,
                                description: description,
                                countries,
                                logo
                                // ...(reference !== '' && { reference: `${key}-payment-method.pdf` }),
                                // ...(link_deriv !== '' && { url: link_deriv }),
                                // ...(locale.length && { locales: locale }),
                            }
    
                    },


                )
    
            return {
                name: it.L(category),
                data,
                // ...(category.includes('Credit') && {
                //     is_cards: true,
                //     note: (
                //         <Localize translate_text="Withdrawals may take up to 15 working days to reflect on your card. Mastercard and Maestro withdrawals are only available for UK clients." />
                //     ),
                // }),
                // ...(category.includes('Crypto') && {
                //     is_crypto: true,
                //     note: (
                //         <Localize translate_text="The minimum amount for withdrawal will vary depending on the latest exchange rates. The figures shown here have been rounded." />
                //     ),
                // }),
                // ...(category.includes('Fiat') && {
                //     is_fiat_onramp: true,
                //     note: (
                //         <Localize translate_text="These payment methods are available exclusively for our clients with crypto trading accounts." />
                //     ),
                // }),
            }
        })
    }
   
   

const renderpaymentData = (payment_data) => {
    if (!payment_data.length) {
        return <p>Sorry! No payment options are available for your country</p>;
    }
    else {
       


        return (
            <div id='payment_methods' className='table-container'>

                { payment_data.map(({name,data}) => {
                    return (
                        <React.Fragment>
                        <TableTitle title={it.L(`${name}`)} dataAnchor={`${name}`} key={`${name}`} />
                        
                        <Table
                         data={{
                        // thead: [ head ],
                        thead: getTableHead(name),
                        tbody: getTableBody(data)
                        
                        
                    }}
                />
                       </React.Fragment>

                    )
                })
                }
            </div>

        )

    }
}

   
    








const PaymentMethods = () => {
    const payment_data = PaymentDataGenerator()
    const sample = renderpaymentData(payment_data)
    

    const deposit                  = 'Deposit: ';
    const withdrawal               = 'Withdrawal: ';
    const period                   = '[_1] day';
    const instant                  = 'Instant';
    const period_range             = '[_1] to [_2] days';
    const not_applicable           = 'Not applicable';
    const blockchain_confirmations = '[_1] blockchain confirmations';

    const createLink = (href) => (`<a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>`);
   

      
   

    // })
    return (

        <div id='cashier-content'>
            <h1>{it.L('Available payment methods')}</h1>

            <p className='pm-description'>{it.L('This is a complete list of supported payment methods. We\'ll show you which payment methods are available in your location on the deposit page.')}</p>
            <CashierNote className='gr-parent' text={it.L('Please do not share your bank account, credit card, or e-wallet with another client, as this may cause delays in your withdrawals.')} />
            <div className='center-text'>
                <p>
                    <Button url='new-account' text={it.L('Open an account now')} />
                    <Button url='cashier/forwardws?action=deposit'  real className='deposit'  text={it.L('Deposit')} />
                    <Button url='cashier/forwardws?action=withdraw' real className='withdraw' text={it.L('Withdraw')} />
                </p>
            </div>


            <div id='payment_methods' className='table-container'>
            
              

              {sample}
              {/*  */}
           {/* 
                <TableTitle title={it.L('Credit/Debit Card')} dataAnchor='credit_debit' /> 
           
           <Table
                    data={{
                        thead: [ head ],
                        tbody: [
                            {
                                id : 'bank-transfer',
                                row: [
                                    { text: <PaymentLogo logo='bank_transfer' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Deposit and withdraw your funds via international bank wire transfer.') },
                                        { td_list: [
                                            { text: 'USD GBP EUR AUD' },
                                            { text: '500 - 100,000' },
                                            { text: '500 - 100,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${period}`, 1), it.L(`${withdrawal}${period}`, 1)]} /> },
                                            { text: <ReferenceLinks /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            
                            
                        ],
                    }}
                /> */}


{/*  */}

                </div>






          <div className='gr-padding-10'>
                <p className='hint'>{it.L('Note:')}</p>
                <ol>
                    <li className='hint' data-show='-eucountry'>{it.L('The minimum amount for withdrawal will vary depending on the latest exchange rates.')}</li>
                    <li className='hint'>{it.L('Additional processing time may be required by your bank or money transfer services for the funds to be credited to your payment account.')}</li>
                </ol>
            </div>
        </div>
    );
};

export default PaymentMethods;
                {/* <TableTitle title={it.L('Credit/Debit Card')} dataAnchor='credit_debit' /> */}
                {/* <Table
                    data={{
                        thead: [ head ],
                        tbody: [ */}
                            // {
                            //     id : 'visa',
                            //     row: [
                            //         { text: <PaymentLogo logo='visa' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Visa is an international company that supports digital payments around the world, most commonly through their brand of credit and debit cards. For more information, please visit [_1].', `${createLink('http://visa.com')}`) },
                            //             { td_list: [
                            //                 { text: 'USD GBP EUR AUD' },
                            //                 { text: '10 - 10,000' },
                            //                 { text: '10 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Credit_Debit.pdf' video_link='https://youtu.be/n_qQbML_qAI' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'mastercard',
                            //     row: [
                            //         { text: <PaymentLogo logo='mastercard' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Mastercard is an international company that processes payments made with Mastercard-branded credit and debit cards. For more information, please visit [_1].', `${createLink('https://www.mastercard.us')}`) },
                            //             { td_list: [
                            //                 { text: 'USD GBP EUR AUD' },
                            //                 { text: '10 - 10,000' },
                            //                 { text: '10 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Credit_Debit.pdf'  video_link='https://youtu.be/n_qQbML_qAI' *//> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'maestro',
                            //     row: [
                            //         { text: <PaymentLogo logo='maestro' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Maestro is an international debit card service by Mastercard. For more information, please visit [_1].', `${createLink('https://brand.mastercard.com/brandcenter/more-about-our-brands.html')}`) },
                            //             { td_list: [
                            //                 { text: 'USD GBP EUR AUD' },
                            //                 { text: '10 - 10,000' },
                            //                 { text: '10 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                //         ],
                //     }}
                // />
{/* 
                <div className='gr-padding-10'>
                    <p className='hint'>{it.L('Note:')} {it.L('Mastercard and Maestro withdrawals are only available for UK Clients.')}</p>
                </div> */}

                {/* <TableTitle title={it.L('E-wallet')} dataAnchor='ewallet' />
                <Table
                    data={{
                        thead: [ head ], */}
                        {/* tbody: [ */}
                            // {
                            //     id      : 'fasapay',
                            //     dataShow: '-eucountry',
                            //     row     : [
                            //         { text: <PaymentLogo logo='fasapay' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('FasaPay enables electronic money transfers for individuals and payment gateways for merchants. For more information, please visit [_1].', `${createLink('https://www.fasapay.com')}`) },
                            //             { td_list: [
                            //                 { text: 'USD' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Fasapay.pdf' video_link='https://youtu.be/PTHLbIRLP58' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id      : 'perfect-money',
                            //     dataShow: '-eucountry',
                            //     row     : [
                            //         { text: <PaymentLogo logo='perfect_money' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Perfect Money allows individuals to make instant payments and money transfers securely on the Internet. For more information, please visit [_1].', `${createLink('https://perfectmoney.is')}`) },
                            //             { td_list: [
                            //                 { text: 'USD EUR' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_PerfectMoney.pdf' video_link='https://youtu.be/fBt71VBp2Pw' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'skrill',
                            //     row: [
                            //         { text: <PaymentLogo logo='skrill' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Skrill offers global payment solutions for individuals who wish to deposit funds, shop online, and transfer money to family and friends. For more information, please visit [_1].', `${createLink('https://www.skrill.com')}`) },
                            //             { td_list: [
                            //                 { text: 'USD GBP EUR AUD' },
                            //                 { text: '10 - 10,000' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Skrill.pdf' video_link='https://youtu.be/pQDVDC-mWuA' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'neteller',
                            //     row: [
                            //         { text: <PaymentLogo logo='neteller' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('NETELLER provides businesses and individuals with a fast, simple, and secure way to transfer money online. For more information, please visit [_1].', `${createLink('https://www.neteller.com')}`) },
                            //             { td_list: [
                            //                 { text: 'USD GBP EUR AUD' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Neteller.pdf' video_link='https://youtu.be/uHjRXzMQ8FY' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'webmoney',
                            //     row: [
                            //         { text: <PaymentLogo logo='webmoney' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('WebMoney is an online payment settlement system that\'s been operating since 1998. For more information, please visit [_1].', `${createLink('https://www.wmtransfer.com')}`) },
                            //             { td_list: [
                            //                 { text: 'USD EUR' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_WebMoney.pdf' video_link='https://youtu.be/e0THC3c-fEE' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id      : 'qiwi',
                            //     dataShow: '-eucountry',
                            //     row     : [
                            //         { text: <PaymentLogo logo='qiwi' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Qiwi is a payment service provider that was founded in 2007. It provides individuals with a simple way to transfer money, receive payments, and pay online. For more information, please visit [_1].', `${createLink('https://qiwi.com')}`) },
                            //             { td_list: [
                            //                 { text: 'USD EUR' },
                            //                 { text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                            //                 { text: <TableValues value={['5 - 180 (USD)', '5 - 150 (EUR)']} /> },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Qiwi.pdf' video_link='https://youtu.be/CMAF29cn9XQ' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'paysafe',
                            //     row: [
                            //         { text: <PaymentLogo logo='paysafe' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('paysafecard offers a voucher-based online payment method that does not require a bank account, credit card, or other personal information. For more information, please visit [_1].', `${createLink('https://www.paysafecard.com')}`) },
                            //             { td_list: [
                            //                 { text: 'USD GBP EUR AUD' },
                            //                 { text: '5 - 1,000' },
                            //                 { text: '5 - 750' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_PaySafeCard.pdf' video_link='https://youtu.be/5QzGc1nleQo' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'jeton',
                            //     row: [
                            //         { text: <PaymentLogo logo='jeton' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Jeton is an international e-wallet for money transfers and online payments. For more information, please visit [_1].', '<a href="https://www.jeton.com/" target="_blank">www.jeton.com</a>') },
                            //             { td_list: [
                            //                 { text: 'USD EUR' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: 'N/A' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'sticpay',
                            //     row: [
                            //         { text: <PaymentLogo logo='sticpay' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Sticpay is a global e-wallet service for money transfers and online payments. For more information, please visit [_1].', '<a href="https://www.sticpay.com" target="_blank">https://www.sticpay.com</a>') },
                            //             { td_list: [
                            //                 { text: 'USD GBP EUR' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: '5 - 10,000' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'airtm',
                            //     row: [
                            //         { text: <PaymentLogo logo='airtm' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Airtm is a global e-wallet service for money transfers and online payments. For more information, please visit [_1].', '<a href="https://www.airtm.io/#/" target="_blank">https://www.airtm.io</a>') },
                            //             { td_list: [
                            //                 { text: 'USD' },
                            //                 { text: '5 - 2,500' },
                            //                 { text: '5 - 2,500' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                //         ],
                //     }}
                // />
                {/* <TableTitle
                    dataShow='-eucountry'
                    title={it.L('Cryptocurrencies')}
                    withdrawal={it.L('Min Withdrawal')}
                    dataAnchor='cryptocurrency'
                /> */}
                {/* <Table
                    id='cryptocurrency'
                    dataShow='-eucountry'
                    data={{ */}
                        {/* // thead: [
                        //     [
                        //         { text: it.L('Method') },
                        //         { attributes: { colSpan: 5, className: 'th-list' }, custom_th : <CustomTableHead data={[ */}
                        {/* //             { text: it.L('Currencies') },
                        //             { text: it.L('Min Deposit') },
                        //             { text: it.L('Min Withdrawal') },
                        //             { text: `${it.L('Processing Time')}*` },
                        //             { text: it.L('Reference') },
                        //         ]}
                        //         />,
                        //         },
                        //     ],
                        // ],
                        // tbody: [ */}
                            // {
                            //     id : 'bitcoin',
                            //     row: [
                            //         { text: <PaymentLogo logo='bitcoin' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Bitcoin is the world\'s first decentralised cryptocurrency, created in 2009. For more information, please visit [_1].', `${createLink('https://bitcoin.org')}`) },
                            //             { td_list: [
                            //                 { text: 'BTC' },
                            //                 { text: '—' },
                            //                 { text: <span data-currency='BTC' /> },
                            //                 { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Bitcoin.pdf' video_link='https://youtu.be/StIW7CviBTw' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'usdc',
                            //     row: [
                            //         { text: <PaymentLogo logo='usdc' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('For more information, please visit [_1].', `${createLink('https://www.centre.io/usdc')}`) },
                            //             { td_list: [
                            //                 { text: 'USDC' },
                            //                 { text: '—' },
                            //                 { text: <span data-currency='USDC' /> },
                            //                 { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: '—' },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'ethereum-black',
                            //     row: [
                            //         { text: <PaymentLogo logo='ethereum_black' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Ether is a cryptocurrency that is used to pay for transactions on the Ethereum platform. For more information, please visit [_1].', `${createLink('https://www.ethereum.org')}`) },
                            //             { td_list: [
                            //                 { text: 'ETH' },
                            //                 { text: '—' },
                            //                 { text: <span data-currency='ETH' /> },
                            //                 { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Ethereum.pdf' video_link='https://youtu.be/B7EVLt3lIMs' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'litecoin',
                            //     row: [
                            //         { text: <PaymentLogo logo='litecoin' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Litecoin is a cryptocurrency similar to Bitcoin, but capable of a higher transaction volume and faster confirmation times. For more information, please visit [_1].', `${createLink('https://www.litecoin.org')}`) },
                            //             { td_list: [
                            //                 { text: 'LTC' },
                            //                 { text: '—' },
                            //                 { text: <span data-currency='LTC' /> },
                            //                 { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Litecoin.pdf' video_link='https://youtu.be/DJhP5UjKPpI' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            // {
                            //     id : 'tether',
                            //     row: [
                            //         { text: <PaymentLogo logo='tether' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: it.L('Tether is a blockchain-based cryptocurrency whose cryptocoins in circulation are backed by an equivalent amount of traditional fiat currencies. For more information, please visit [_1].', `${createLink('https://www.tether.to')}`) },
                            //             { td_list: [
                            //                 { text: 'USDT' },
                            //                 { text: '—' },
                            //                 { text: <span data-currency='UST' /> },
                            //                 { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${period}`, 1)]} /> },
                            //                 { text: <ReferenceLinks /* pdf_file='Binary.com_Tether.pdf' video_link='https://youtu.be/N1WPsq67290' */ /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                        // ],
                    // }}
                // />

            //     <div className='gr-padding-10' data-show='-eucountry'>
            //         <p className='hint'>{it.L('Note:')} {it.L('Figures have been rounded.')}</p>
            //     </div>
            // </div>

  
