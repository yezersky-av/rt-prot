/**
 * Created by vizrael on 21.05.2017.
 */
class Mediator
{
    constructor()
    {
        this.event = {};
    }

    subscribeEvent(event, callback)
    {
        if(!this.event[event])
        {
            this.event[event] = [];
        }

        this.event[event].push(callback);
    }

    publishEvent(event, argument)
    {
        if(this.event[event])
        {
            for(let index in this.event[event])
            {
                this.event[event][index](argument);
            }
        }
    }
}

export default new Mediator();
