const { createServer } = require("http");
const { Server } = require("socket.io");
const _ = require("underscore");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8
});

io.on("connection", (socket) => {
    console.log("Client connected!", socket.id);
});

httpServer.listen(8080, () => {
    console.log("Listening on port 8080...")
});

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const randomData = () => {
    return _.sortBy(
        _.range(1, 15).map(n => {
            const t = new Date(new Date().getTime() - Math.ceil((Math.random() * 10) * 60 * 1000));
            return {
                time: t,
                exp: randomDate(t, new Date(new Date(t).setDate(t.getDate() + Math.ceil((Math.random() * 10))))),
                atm: Math.round(Math.random() * 1000) / 100,
                rr_25: (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 100) / 100,
                rr_10: (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 100) / 100,
                bf_25: (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 100) / 100,
                bf_10: (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 100) / 100,
            }
        }),
        "time"
    );
};

setInterval(() => {
    io.emit("RR/BF", randomData());
    io.emit("Call/Put", randomData());
},1);