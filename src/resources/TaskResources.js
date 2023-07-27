const backend_url = import.meta.env.VITE_BACKEND_URL;

export default {

    getAll( ){
        return fetch(backend_url, { headers: { "Accept": "application/json" }})
    },

    getTask( id ){
        const headers = {
            method:'GET',
            headers: {
                'Accept': 'application/json',
            }
        }
        return fetch(`${backend_url}/${id}`, headers);
    },

    store( task ){
        const headers = {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        }
        return fetch(backend_url, headers);
    },

    edit( task ) {
        const headers = {
            method:'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }
        return fetch(`${backend_url}/${task.id}`, headers);
    },

    delete( id ) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        }
        return fetch(`${backend_url}/${id}`, requestOptions);
    }
}
