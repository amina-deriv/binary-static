import React from 'react';
import fs from 'fs';
import { CashierNote } from './index.jsx';
import payment_method_json from '../../../javascript/app/pages/cashier/payments_page/payment_methods.json';
import { Table } from '../../_common/components/elements.jsx';
import Loading from '../../_common/components/loading.jsx';

const Button = ({ url, real, className, text }) => (
    <a href={it.url_for(url)} className={`toggle button ${real ? 'client_real' : 'client_logged_out'} invisible ${className || undefined}`}>
        <span>{text}</span>
    </a>
);

const TableTitle = ({ title, className, dataShow, dataAnchor }) => (
    <h3 className={`gr-padding-10${className ? ` ${className}` : ''}`} data-show={dataShow} data-anchor={dataAnchor}>{title}</h3>
);

const TableValues = ({ value }) => {
    const values = Array.isArray(value) ? value : [value];
    return (
        <React.Fragment>
            { values.reduce((arr, e, inx) => arr === null ? [e] : [...arr, <br key={inx} />, e], null)}
        </React.Fragment>
    );
};

const PaymentLogo = ({ logo, name }) => {
    const logoFilePath = `src/images/pages/home/payment/${logo}.svg`;
    if (!fs.existsSync(logoFilePath)) {
        return <div className='payment-methods__noIconText'>{`${name}`}</div>;
    }
    return <img src={it.url_for(`images/pages/home/payment/${logo}.svg`)} />;
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
    const categories = {};
    json.map((data) => {
        const { category } = data;
        if (categories[category] === undefined) {
            categories[category] = [];
        }
        categories[category].push({ ...data });
    });
    return categories;
};

const getsortedCategories = (categories) => {
    const sorted_categories = [];
    const default_order = ['Banking', 'Credit', 'wallet', 'Crypto', 'Fiat'];
    categories.map((category) => {
        default_order.forEach((order, index) => {
            if (category.includes(order)) {
                sorted_categories[index] = category;
            }
        });
    });
    return sorted_categories;
};

const getCurrency = (currencies) => {
    if (currencies.length === 1) return currencies[0].join(' ');
    const values = currencies.map(group => `${group.join(' ')}`);
    return (<TableValues value={values} />);
};

const getDepositLimit = (min_deposit, max_deposit) => {
    if (min_deposit === 'Not Available' && max_deposit === 'Not Available') {
        return ('-');
    }
    if (min_deposit.includes('|') && max_deposit.includes('|')) {
        const min_deposit_array = min_deposit.split('|');
        const max_deposit_array = max_deposit.split('|');
        const values = min_deposit_array.map((amount, i) => `${amount} - ${max_deposit_array[i]}`);
        return (<TableValues value={values} />);
    }
    return (`${min_deposit} - ${max_deposit}`);
};

const getCryptoMinWithdrawal = (item) => {
    let data_currency = '';
    switch (item) {
        case 'bitcoin': data_currency = 'BTC'; break;
        case 'usdc': data_currency = 'USDC'; break;
        case 'ethereumblack': data_currency = 'ETH'; break;
        case 'litecoin': data_currency = 'LTC'; break;
        case 'tether': data_currency = 'UST'; break;
        // no default
    }

    return data_currency;
};

const getWithdrawalLimit = (min_withdrawal, max_withdrawal, categoryId, item) => {
    if (max_withdrawal === 'Not Available') {
        if (isCrypto(categoryId)) {
            const data_currency = getCryptoMinWithdrawal(item);
            return (<span data-currency={`${data_currency}`} />);
        }
        return (`${min_withdrawal}`);
    }
    if (min_withdrawal.includes('|') && max_withdrawal.includes('|')) {
        const min_withdrawal_array = min_withdrawal.split('|');
        const max_withdrawal_array = max_withdrawal.split('|');
        const values = min_withdrawal_array.map((amount, i) => `${amount} - ${max_withdrawal_array[i]}`);
        return (<TableValues value={values} />);
    }
    return (`${min_withdrawal} - ${max_withdrawal}`);
};

const getProcessingTime = (deposit_time, withdrawal_time) => {
    const deposit = 'Deposit: ';
    const withdrawal = 'Withdrawal: ';
    return (<TableValues value={[it.L(`${deposit}${deposit_time}`), it.L(`${withdrawal}${withdrawal_time}`)]} />);
};

const getReferenceFiles = (key, reference) => {
    const ispdfAvailable = fs.existsSync(`src/download/payment/Binary.com_${key}.pdf`);
    if (reference !== '' && ispdfAvailable) {
        return <ReferenceLinks pdf_file={`Binary.com_${key}.pdf`} />;
    }
    return (<ReferenceLinks />);
};

const createLink = (href) => (`<a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>`);

const isCrypto = (categoryId) => categoryId.includes('crypto');

const getDescription = (description, link) => {
    if (!link) return (it.L(`${description}`));
    return (it.L(`${description} For more information, please visit [_1].`, `${createLink(`${link}`)}`));
};

const getTableHead = (categoryId) => ([[
    { text: it.L('Method') },
    {
        attributes: { colSpan: 5, className: 'th-list' }, custom_th : <CustomTableHead data={[
            { text: it.L('Currencies') },
            { text: categoryId.includes('crypto') ? `${it.L('Min Deposit')}` : `${it.L('Min-Max Deposit')}` },
            { text: categoryId.includes('crypto') ? `${it.L('Min Withdrawal')}` : `${it.L('Min-Max Withdrawal')}` },
            { text: `${it.L('Processing Time')}*` },
            { text: it.L('Reference') },
        ]}
        />,
    },
]]);

const getTableBody = (categoryId, data) =>
    (
        data.map(item => ({
            id : `${item.key}`,
            row: [
                { text: <PaymentLogo logo={`${item.logo}`} name={`${item.name}`} /> },
                {
                    attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                        { td: getDescription(item.description, item.link_binary) },
                        {
                            td_list: [
                                { text: getCurrency(item.currencies) },
                                { text: getDepositLimit(item.min_deposit, item.max_deposit) },
                                { text: getWithdrawalLimit(item.min_withdrawal, item.max_withdrawal, categoryId, item.key) },
                                { text: getProcessingTime(item.deposit_proccessing_time, item.withdrawal_processing_time) },
                                { text: getReferenceFiles(item.key, item.reference) },
                            ],
                        },
                    ]}
                    />,
                },
            ],
        })
        )
    );

const paymentDataGenerator = () => {

    const categorized_payment_methods = CategorizePaymentMethod(payment_method_json);
    const sortedCategories = getsortedCategories(Object.keys(categorized_payment_methods));
    return sortedCategories.map((category) => {
        const payment_methods = categorized_payment_methods[category];
        const data = payment_methods && payment_methods.map(item => ({ ...item }));
        return {
            name: category,
            id  : `${category.replace(/\W/g, '').toLowerCase()}`,
            data,
        };
    });
};

const CategoryNote = ({ categoryId }) => {
    if (isCrypto(categoryId)) {
        return (
            <div className='gr-padding-10'>
                <p className='hint'>{`${it.L('Note:')} ${it.L('Figures have been rounded.')}`}</p>
            </div>
        );
    } else if (categoryId.includes('credit')) {
        return (
            <div className='gr-padding-10'>
                <p className='hint'>{`${it.L('Note:')} ${it.L('Mastercard and Maestro withdrawals are only available for UK Clients.')}`}</p>
            </div>
        );
    }
    return null;
};

const RenderPaymentData = () => {
    const payment_data = paymentDataGenerator();

    return (
        <div id='payment_methods' className='table-container invisible'>
            {payment_data.map(({ name, id, data }) =>
                (
                    <div key={name} id={id}>
                        <TableTitle title={it.L(`${name}`)} dataAnchor={`${id}`} />
                        <Table
                            data={{
                                thead: getTableHead(id),
                                tbody: getTableBody(id, data),
                            }}
                        />
                        <CategoryNote categoryId={`${id}`} />
                    </div>
                )
            )
            }
        </div>
    );
};

const PaymentMethods = () => (

    <div id='cashier-content'>

        <h1>{it.L('Available payment methods')}</h1>
        <p className='pm-description'>{it.L('This is a complete list of supported payment methods. We\'ll show you which payment methods are available in your location on the deposit page.')}</p>
        <CashierNote className='gr-parent' text={it.L('Please do not share your bank account, credit card, or e-wallet with another client, as this may cause delays in your withdrawals.')} />
        <div className='center-text'>
            <p>
                <Button url='new-account' text={it.L('Open an account now')} />
                <Button url='cashier/forwardws?action=deposit' real className='deposit' text={it.L('Deposit')} />
                <Button url='cashier/forwardws?action=withdraw' real className='withdraw' text={it.L('Withdraw')} />
            </p>
        </div>

        <div id='payment_methods_loading'>
            <Loading />
        </div>
        <div id='no_payment_methods' className='invisible'>
            <p>{it.L('Sorry! No payment options are available for your country')}</p>
        </div>

        <RenderPaymentData />

        <div className='gr-padding-10 invisible' id='payments_footer'>
            <p className='hint'>{it.L('Note:')}</p>
            <ol>
                <li className='hint' data-show='-eucountry'>{it.L('The minimum amount for withdrawal will vary depending on the latest exchange rates.')}</li>
                <li className='hint'>{it.L('Additional processing time may be required by your bank or money transfer services for the funds to be credited to your payment account.')}</li>
            </ol>
        </div>
    </div>
);

export default PaymentMethods;
