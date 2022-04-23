module.exports = {
    env: {
        DB_LOCAL_URI: '',
        DB_URI: 'mongodb+srv://harshit:harshit@cluster0.yosph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',

        STRIPE_API_KEY: 'pk_test_51JkRMBSBeKl8WkWItc8FO9xH1JR2dr1OirUaA8ddTg8BQGOsJoTs2Ahmw6byL88bvCbhr8rbbXIeEaZCzYXFhc0H00voNs1HVP',
        STRIPE_SECRET_KEY: 'sk_test_51JkRMBSBeKl8WkWIrw6Wotx7pUEzTwK8xnWMvMNDUYFlFuZLko8yq8YO4RnSndU6bnj1e4CuuFVS0HBtLfwLNAz600vASp5kgi',

        STRIPE_WEBHOOK_SECRET: 'whsec_3yHqem56XByFf4oE2xhVB8KYOzNOZ7kC',
        CLOUDINARY_CLOUD_NAME: 'harshit111',
        CLOUDINARY_API_KEY: '872437891895558',
        CLOUDINARY_API_SECRET: 'N9l0hKaYJECvTShq2YejDvAmsEM',

        SMTP_HOST: "",
        SMTP_PORT: "",
        SMTP_USER: "harshitrathi200105@gmail.com",
        SMTP_PASSWORD: "kwjoyehfmxzzzugo",
        SMTP_FROM_EMAIL: "harshitrathi200105@gmail.com",
        SMTP_FROM_NAME: "Harshit Rathi",
        NEXTAUTH_URL: "https://roombook.vercel.app/",
    },
    images: {
        domains: ['res.cloudinary.com'],
    },
}