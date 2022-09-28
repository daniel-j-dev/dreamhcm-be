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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokenUtils_1 = require("../auth/tokenUtils");
const paymentModel_1 = require("../mongodb/paymentModel");
const teamMemberModel_1 = require("../mongodb/teamMemberModel");
const express_validator_1 = require("express-validator");
// Setup Router
const router = express_1.default.Router();
// Create a payment
router.post("/payment", tokenUtils_1.verifyToken, (0, express_validator_1.body)("teamMemberId").isString(), (0, express_validator_1.body)("payAmount").isFloat({ min: 0, max: 1000000000 }), (0, express_validator_1.body)("originalAmount").isFloat({ min: 0, max: 1000000000 }), (0, express_validator_1.body)("modifications").isArray(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate req.body ...
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        // Check if teamMemberId is valid in teamMembers
        const foundMember = yield (0, teamMemberModel_1.getTeamMemberById)(req.body.teamMemberId);
        if (!foundMember) {
            res.status(404).send("Team member with matching ID was not found.");
            return;
        }
        // Create
        const newPayment = {
            teamMemberId: req.body.teamMemberId,
            payAmount: req.body.payAmount,
            originalAmount: req.body.originalAmount,
            modifications: req.body.modifications,
        };
        (0, paymentModel_1.createPayment)(newPayment)
            .then(() => {
            res.status(201).send("Created payment successfully!");
        })
            .catch((error) => {
            console.log(error);
            res.status(500).send("Database error.");
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Server error.");
    }
}));
// Get payment by teamMemberID
// No express-validator - it kept sending needless 400 errors
// ... likely because we're accessing req.body from a get request
router.get("/payment", tokenUtils_1.verifyToken, (req, res) => {
    // Find payments
    (0, paymentModel_1.getMemberPayments)(req.body.teamMemberId)
        .then((found) => {
        if (!found) {
            res.status(404).send("No payments found for this member.");
            return;
        }
        res.status(200).send(found);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).send("Database error.");
    });
});
exports.default = router;
