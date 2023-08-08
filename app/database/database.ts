import { connect } from "mongoose"

export const db = connect("mongodb://127.0.0.1:27017/task-manager", {
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => {
  console.log('Conexão com o MongoDB estabelecida com sucesso');
})
.catch((error) => {
  console.error('Erro na conexão com o MongoDB:', error);
});
