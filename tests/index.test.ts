let expect = require("chai").expect;
let index = require("./../dist/index");

describe('MessageBus', () => {
  it('add', () => {
    let bus = new index();


    expect(1).equal(1);
  }); 
});