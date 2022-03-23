const Express = require("express");
const router = Express.Router();
const Bank = require("../model/bank");


router.post("/addBankAccount", async (request, response) => {

    //get bank information and add to schema
    console.log(request.body)
    const {firstName, lastName, account, countryCode, cvv, expiry} = request.body;

    //validate all fields
    if (!firstName || !lastName || !account || !countryCode || !cvv || !expiry) {
        return response.status(400).send("Please fill out all fields");
    }

    //validate account number
    if (account.toString().length !== 16) {
        console.log(account.toString().length)
        return response.status(400).send("Please enter a valid account number");
    }

    //validate cvv
    if (cvv.length !== 3) {
        return response.status(400).send("Please enter a valid cvv");
    }

    //validate expiry
    if (expiry.length !== 4) {
        return response.status(400).send("Please enter a valid expiry");
    }

    //check if user already has account
    const bank = await Bank.findOne({account: account});
    if (bank) {
        return response.status(400).send("You already have a bank account");
    }


    const bankData = new Bank({
        firstName: firstName,
        lastName: lastName,
        account: account,
        countryCode: countryCode,
        cvv: cvv,
        expiry: expiry,
        balance: 0
    });

    //save bank information to database
    try {
        bankData.save().then(() => {
            response.status(200).send("Bank account added successfully");
        }).catch((error) => {
            response.status(400).send(error);
        });
    } catch (error) {
        response.status(400).send(error);
    }
});

router.post("/removeBankAccount", async (request, response) => {

    //delete bank account if cvv expiry and account are correct
    const {account, cvv, expiry} = request.body;
    //validate
    if (!account || !cvv || !expiry) {
        return response.status(400).send("Please fill out all fields");
    }
    //delete
    try {
        Bank.deleteOne({account: account, cvv: cvv, expiry: expiry}).then(() => {
            response.status(200).send("Bank account deleted successfully");
        }).catch((error) => {
            response.status(400).send(error);
        });
    } catch (error) {
        response.status(400).send(error);
    }

});

router.post("/getBankData", async (request, response) => {

    //get data if cvv expiry and account are correct
    const {account, cvv, expiry} = request.body;
    //validate 
    if (!account || !cvv || !expiry) {
        return response.status(400).send("Please fill out all fields");
    }
    //get
    try {
        Bank.findOne({account: account, cvv: cvv, expiry: expiry}).then((bank) => {
            response.status(200).send(bank);
        }).catch((error) => {
            response.status(400).send(error);
        });
    } catch (error) {
        response.status(400).send(error);
    }

});

router.post("/addAmount", async (request, response) => {

    //add amount if cvv expiry and account are correct
    const {account, cvv, expiry, amount} = request.body;
    //get
    if (!account || !cvv || !expiry || !amount) {
        return response.status(400).send("Please fill out all fields");
    }

    //check if amount is negative
    if (amount < 0) {
        return response.status(400).send("Please enter a valid amount");
    } 

    try {
        Bank.findOne({account: account, cvv: cvv, expiry: expiry}).then((bank) => {
            bank.balance += amount;
            bank.save().then(() => {
                response.status(200).send("Amount added successfully");
            }).catch((error) => {
                response.status(400).send(error);
            });
        }).catch((error) => {
            response.status(400).send(error);
        });
    } catch (error) {
        response.status(400).send(error);
    }

});

router.post("/deductAmount", async (request, response) => {

    //deduct amount if cvv expiry and account are correct
    const {account, cvv, expiry, amount} = request.body;
    if (!account || !cvv || !expiry || !amount) {
        return response.status(400).send("Please fill out all fields");
    }
    if (amount < 0) {
        return response.status(400).send("Please enter a valid amount");
    } 
    //get
    try {
        Bank.findOne({account: account, cvv: cvv, expiry: expiry}).then((bank) => {
            //check if amount is greater than balance
            if (amount > bank.balance) {
                return response.status(400).send("Insufficient funds");
            }
            bank.balance -= amount;
            bank.save().then(() => {
                response.status(200).send("Amount deducted successfully");
            }).catch((error) => {
                response.status(400).send(error);
            });
        }).catch((error) => {
            response.status(400).send(error);
        });
    } catch (error) {
        response.status(400).send(error);
    }
});

module.exports = router;
