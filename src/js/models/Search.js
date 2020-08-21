import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;

    }

    //Data model stores results in an object
    async getResults(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
        }catch(error) {
            alert("Recipe API did not find results for that dish. Try checking spelling or searching for another dish like pizza, pie, or salad!", error);
        }
    }
}