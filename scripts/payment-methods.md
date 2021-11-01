## Payment Methods Generator Guide

A guide to properly generate a new JSON file for updated payment methods.

### Steps

- The source file must be named `payment-methods.csv`
- It must be stored in `scripts/data` directory
- To manually generate the JSON run command `npm run build:payment_methods`
- By default it will generate a JSON file from the source csv when the app is build.
- The output JSON will live in `src/javascript/app/pages/cashier/payments_page` directory under `payment-methods.json` name. 


- The logos are stored as svg files under 'src/images/pages/home/payment' as `{key}`.svg. 

- The PDF files are stored in the directory 'src/download/payment' as `Binary.com_{key}.pdf`.