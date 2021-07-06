'use strict';

require('dotenv').config();

const server = require('../api-server/src/server.js').server;
require('@code-fellows/supergoose');
const supertest = require("supertest");
const mockserver = supertest(server);


let foodItem = {
    name: "bread",
    calories: 10,
    type: "PROTIEN"
}

describe("V1 Routes", () => {

    it("POST /api/v1/:model adds an item to the DB and returns an object with the added item", async() => {
        let test = await mockserver.post('/api/v1/food').send(foodItem);

        expect(test.body.name).toEqual("bread");
        expect(test.status).toEqual(201);
    });


    it("GET /api/v1/:model returns a list of :model items", async() => {
        let test = await mockserver.get('/api/v1/food');

        expect(test.body[0].calories).toEqual(10);
        expect(test.status).toEqual(200);
    });



    it("GET /api/v1/:model/ID returns a single item by ID", async() => {
        let test = await mockserver.get('/api/v1/food');
        let id = test.body[0]._id

        let test2 = await mockserver.get(`/api/v1/food/${id}`);

        expect(test2.body.type).toEqual("PROTIEN");
        expect(test2.status).toEqual(200);
    });

    it("PUT /api/v1/:model/ID returns a single, updated item by ID", async() => {
        let test = await mockserver.get('/api/v1/food');
        let id = test.body[0]._id

        let updatedItem = {
            name: "bread",
            calories: 20,
            type: "PROTIEN"
        }

        let test2 = await mockserver.put(`/api/v1/food/${id}`).send(updatedItem);

        expect(test2.body.calories).toEqual(20);
        expect(test2.status).toEqual(200);
    });


    it("DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found", async() => {
        let test = await mockserver.get('/api/v1/food');
        let id = test.body[0]._id



        let toDelete = await mockserver.delete(`/api/v1/food/${id}`)
        let toGetDeleted = await mockserver.get(`/api/v1/food/${id}`);

        expect(toDelete.body.name).toEqual("bread");
        expect(toDelete.status).toEqual(200);

        expect(toGetDeleted.body).toEqual(null);
    });



});