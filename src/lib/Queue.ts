export let queues = new Map<String, Queue>()

class Question {
    asker: string;
    question: string;

    constructor(asker:string = '', question:string = '') {
        this.asker = asker;
        this.question = question;
    }

    toObject(): object {
      return structuredClone(this)
    }

    toJSON() : string {
        return JSON.stringify(this.toObject())
    }
}

class Queue {
    name: string;
    questions: Question[];

    constructor( name: string ){
        this.name = name;
        this.questions = [];
    }

    toObject(): object {
        return structuredClone(this)
    }

    toJSON(): string {
        return JSON.stringify(this.toObject())
    }

}

export {Question, Queue}