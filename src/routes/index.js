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
const loggers_1 = require("@/utils/loggers");
const router = express_1.default.Router();
const logger = (0, loggers_1.getLogger)('INDEX_ROUTE');
const database_1 = __importDefault(require("../utils/database"));
/* GET home page. */
router.get('/', function (_req, res, _next) {
    res.render('index');
});
router.get('/add', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const clients = yield database_1.default.execute('SELECT client_id, client_name FROM client WHERE client_state = "active"');
        const types = yield database_1.default.execute('SELECT type_id, type_name FROM type WHERE type_state = "active"');
        res.render('addForm', { clients: clients[0], types: types[0] });
    });
});
router.get('/clients', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const clients = yield database_1.default.execute('SELECT client_id, client_name FROM client WHERE client_state = "active"');
        res.send(clients[0]);
    });
});
router.get('/types', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const types = yield database_1.default.execute('SELECT type_id, type_name FROM type WHERE type_state = "active"');
        res.send(types[0]);
    });
});
router.post('/trx', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(req.body);
        let debe = 0;
        let haber = 0;
        let importe = req.body.import;
        if (req.body.import.includes(',')) {
            importe = req.body.import.replace(',', '.');
        }
        if (req.body.trx == '1') {
            debe = parseFloat(importe);
        }
        else {
            haber = parseFloat(importe);
        }
        const { client, trx, date } = req.body;
        const queryText = 'INSERT INTO trx (client_id, type_id, trx_debe, trx_haber, trx_date) VALUES (?,?,?,?,?)';
        yield database_1.default.execute(queryText, [parseInt(client), parseInt(trx), debe, haber, date]);
        res.redirect('/add');
    });
});
exports.default = router;
