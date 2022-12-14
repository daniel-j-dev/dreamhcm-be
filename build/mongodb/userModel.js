"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNSAFE_getUserByEmail = exports.createUser = exports.getUserByEmail = exports.getAllUsers = void 0;
const { user } = require("./schemas");
// Get all users
const getAllUsers = () => {
    return user.find({});
};
exports.getAllUsers = getAllUsers;
// Get user by email
const getUserByEmail = (email) => {
    return user.findOne({ email: email });
};
exports.getUserByEmail = getUserByEmail;
// Create user
const createUser = (usrObj) => __awaiter(void 0, void 0, void 0, function* () {
    return user.create(usrObj);
});
exports.createUser = createUser;
// Returns user with password hash
const UNSAFE_getUserByEmail = (email) => {
    return user
        .findOne({ email: email }, { _id: 1, email: 1, password: 1, dateAdded: 1 })
        .select();
};
exports.UNSAFE_getUserByEmail = UNSAFE_getUserByEmail;
