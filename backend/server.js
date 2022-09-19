const express = require('express')
const cors = require('cors')
const app = express()
const nedb = require('nedb-promise')
const bcryptFunction = require('bcrypt.js')


app.use(cors({
    origin: '*'
}))

app.use (express.json())

const accountsDB = new nedb ({filename: 'accounts.db', autoload : true })


//sign up
app.post('/api/signup', async (request, response)=>{
    const credentials = request.body

    const resObj ={
        success : true,
        userNameExist : false,
        userEmailExist : false,
    }

    const findUser = await accountsDB.find ({
        username : credentials.username
    })
    const findEmail = await accountsDB.find ({
        email : credentials.email
    })

    if(findUser > 0 || findEmail > 0) {
        resObj.success = false,
        resObj.userNameExist=true,
        resObj.userEmailExist=true

    }else{
        const hashPass = await bcryptFunction.hashPassword(credentials.password)
        credentials.password = hashPass
        accountsDB.insert(credentials)

    }
    response.json(resObj)

})




//login


//add photo


//delete photo 


//log out




app.listen(2009,() =>{
    console.log('Server listening to port 2009')
})