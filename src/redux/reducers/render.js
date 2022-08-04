const init_state = {
    value: false,
}

import render_types from "./types/render"

const render_reducer = (state = init_state, action) =>{
    if(action.type == render_types.AUTO_RENDER){
        return {
            ...state,
            value : action.payload.value
        }

    } 
    return state
}

export default render_reducer