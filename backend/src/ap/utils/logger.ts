import winston from "winston";

const levelFilter = (level: string) => {
	return winston.format((info) => {
		return info.level === level ? info : false;
	})();
};

const logger = winston.createLogger({
	level: "info", // Default logging level
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({level, message, timestamp}) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		}),
	),
	transports: [
		// Separate transports for each level
		new winston.transports.File({
			filename: "logs/error.log",
			format: winston.format.combine(levelFilter("error")),
		}),
		new winston.transports.File({
			filename: "logs/warning.log",
			format: winston.format.combine(levelFilter("warn")),
		}),
		new winston.transports.File({
			filename: "logs/info.log",
			format: winston.format.combine(levelFilter("info")),
		}),
		new winston.transports.File({filename: "logs/requests.log"}),
	],
});

if (process.env.NODE_ENV !== "production"){
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
	);
}

export default logger;
