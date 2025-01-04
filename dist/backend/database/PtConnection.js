"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PtConnection = void 0;
var tedious_1 = require("tedious");
var PtConnection = /** @class */ (function () {
    function PtConnection() {
        var config = {
            server: 'localhost',
            //port: '51397',
            authentication: {
                type: 'default',
                options: {
                    userName: 'ootp_pt',
                    //userName: 'DESKTOP-LREGU2K\\efrye',
                    password: 'securepassword',
                }
            },
            options: {
                trustServerCertificate: true,
                database: "ootp_data"
            }
        };
        this.connection = new tedious_1.Connection(config);
    }
    PtConnection.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var connection = _this.connection;
            connection.on('connect', function (err) {
                if (err) {
                    console.log("There was an issue connecting");
                    reject(err);
                }
                else {
                    resolve(connection);
                }
            });
            connection.connect();
        });
    };
    return PtConnection;
}());
exports.PtConnection = PtConnection;
//# sourceMappingURL=PtConnection.js.map