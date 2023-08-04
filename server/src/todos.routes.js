const express = require('express');

const todosRoutes = express.Router();

const {PrismaClient} = require('@prisma/client')//importando o prisma client

const prisma = new PrismaClient()//instanciando o prisma client



//C - create: criar uma todo
todosRoutes.post('/todos', async (req, res) => {
    const {name} = req.body; //pegando o name do body da requisição 

    const todo = await prisma.todo.create({
        data: { //data é o objeto que vai ser criado no banco de dados
        name,
        },
    });

    return res.status(201).json(todo)
});

//R - read: ler uma todo
todosRoutes.get('/todos', async (req, res) => {
    const todos = await prisma.todo.findMany() //retornar as todos que estão salvas no banco de dados
    return res.status(200).json(todos)
});


//U - update: atualizar uma todo
todosRoutes.put('/todos', async (req, res) => {

    const {name, id, status} = req.body;

    //verificações

    if(!id){//verificando se o id foi passado
        return res.status(400).json('Id is required') //caso não tenha id, retorna erro
    }

    const todoAlreadyExists = await prisma.todo.findUnique({//verificando se o id já existe
        where:{ 
            id,
        }
    }); 

    if(!todoAlreadyExists){//verificando se o id já existe
        return res.status(400).json('Todo does not exists') //caso o id digitado não exista, retorna erro
    }


    const todo = await prisma.todo.update({
        //filtro
        where: {
            id, //id tem que ser igual ao id que está sendo passado no body
        },
        //dados que serão atualizados
        data:{
            name,
            status,
        },
    });

    return res.status(200).json(todo)
})

//D - delete: deletar uma todo 
todosRoutes.delete('/todos/:id', async (req, res) => { //:id é um parametro que vai ser passado na url
    //dessa vez, não vamos pegar o id do body, e sim da url
    const {id} = req.params; 

    const intId = parseInt(id); //convertendo o id para inteiro

    //verificações
    if(!intId){ 
        return res.status(400).json('Id is required') 
    } 

    const todoAlreadyExists = await prisma.todo.findUnique({
        where:{ 
            id: intId,
        }
    });

    if(!todoAlreadyExists){//verificando se o id já existe
        return res.status(400).json('Todo does not exists') //caso o id digitado não exista, retorna erro
    }

    await prisma.todo.delete({where:{id: intId}}) //deletando a todo onde o id é igual ao id passado na url
    return res.status(200).json('Todo deleted') //retornando uma mensagem de sucesso

}); 


module.exports = todosRoutes;