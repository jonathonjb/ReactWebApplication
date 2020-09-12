import { createStore } from 'redux';
import rootReducer from './Reducers/rootReducer';

export default function configureStore(){
    return createStore(rootReducer);
}