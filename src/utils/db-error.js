class DataBaseError extends Error {
  constructor(message) {
    super(message);

    this.name = "DataBaseError";
    this.message = message;
  }
}

export default DataBaseError;
