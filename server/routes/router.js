const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs')

router.post('/getHospitals', async (req, res) => {
    try {

        const { district_id, date, limit } = req.body;

        // Validations...........................
        if (typeof (district_id) !== "number") {
            res.status(500).json({ message: "District_id must be an integer" })
        }
        else if (typeof (date) !== "string") {
            res.status(500).json({ message: "Date must be a string" })
        }
        else if (typeof (limit) !== "number") {
            res.status(500).json({ message: "Limit must be a number" })
        }
        else if (limit < 1) {
            res.status(500).json({ message: "Invalid limit" })
        }

        const lim = limit ? limit : 10;

        // api call..................................
        const response = await axios.get(
            `${process.env.URL}?district_id=${district_id}&date=${date}`
        )

        const datas = [...response.data.centers.slice(0, lim)];

        if (datas.length === 0) res.status(500).json({ message: "Invalid district_id entered!" })

        const result = datas.map((data) => {
            const object = {
                name: data.name,
                sessions: data.sessions.map((element) => {
                    const obj = {
                        available_capacity: element.available_capacity,
                        vaccine: element.vaccine
                    }
                    return obj;
                })
            }
            return object;
        })

        fs.writeFile("hospitals.txt", JSON.stringify(result), (err) => {
            if (err)
                console.log(err);
            else
                console.log('Write operation complete.');
        })

        res.status(200).json({ message: "Hospitals sent successfully", result })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Invalid date entered!" })
    }
})

module.exports = router;  