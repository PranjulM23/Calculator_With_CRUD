const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors")
require("dotenv").config();

const mongoose = require("mongoose");
const userModels = require("./models/database.js");
const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
const port = process.env.PORT || 8080
const connection = () => {
    mongoose.connect(process.env.mongo_url).then(() => {
        console.log("MongoDB connected");
    }).then((err) => { console.log(err) });
}
connection();
app.post('/', async (req, res) => {
    try {
        const user = await userModels.create(req.body);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while posting the user"
        });
    }
})
app.get('/', async (req, res) => {
    try {
        const user = await userModels.find();
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while getting the user"
        });
    }
})
app.get('/:id', async (req, res) => {
    try {
        const user = await userModels.findById(req.params.id);
        if (!user) {
           return res.status(500).json({
                success: false,
                message:"Not found"
            })
            
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while getting the user"
        });
    }
})

app.delete('/:id', async (req, res) => {
    try {
        const user = await userModels.findByIdAndRemove(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user"
        });
    }
});
app.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const users = await userModels.findById(id);
      if (!users) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      const updatedUser = await userModels.findByIdAndUpdate(id, updateData, { new: true,useFindAndModify:false });
  
  
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the user"
      });
    }
  });
app.listen(port, () => {
    console.log("App Listening")
})


// {}