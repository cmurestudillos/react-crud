import {useState, useEffect} from 'react';
import {Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Swal from 'sweetalert2';

const HeroeComponent = () => {
    let navigate = useNavigate ();
    const endpoint = 'https://crud-frameworks-default-rtdb.europe-west1.firebasedatabase.app';
    const { id } = useParams();
    const [heroeId, setHeroeId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [poder, setPoder] = useState("");
    const [estado, setEstado] = useState(false);
    const [selectedHeroe, setSelectedHeroe] = useState({
        id: "",
        nombre: "",
        poder: "",
        estado: false,
      });

    useEffect(() => {
        if(id !== 'nuevo' && id !== "undefined"){
            setHeroeId(id);
            getHeroeById(id);
        }
    }, [heroeId]);

    const getHeroeById = (heroeId) => {
        axios.get(endpoint + "/heroes/" + heroeId + '.json')
        .then(res => {
            if(res.data){
                setSelectedHeroe(res.data)
            }
        });
    };  

    const handleOnChangeNombre = (e) => {
        setNombre(e.target.value);
        setSelectedHeroe({
            nombre: e.target.value,
            poder: poder,
            estado: estado
        })
    }

    const handleOnChangePoder = (e) => {
        setPoder(e.target.value);
        setSelectedHeroe({
            nombre: nombre,
            poder: e.target.value,
            estado: estado
        })
    }

    const handleOnChangeEstado = (e) => {
        if(e.target.id !== 'Vivo'){
            setEstado(true);
            setSelectedHeroe({
                nombre: nombre,
                poder: poder,
                estado: true
            })
        } else {
            setEstado(false);
            setSelectedHeroe({
                nombre: nombre,
                poder: poder,
                estado: false
            })
        }
    }


    const onSubmit = (e) => {
        e.preventDefault();

        if(heroeId !== 'nuevo' && heroeId !== undefined && heroeId !== null){
            selectedHeroe.id = heroeId;
            setSelectedHeroe({id, nombre, poder, estado})
            axios.put(endpoint + '/heroes/' + heroeId + '.json', selectedHeroe)
            .then( res => {
                if(res.data){
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "El Heroe ha sido modificado correctamente.",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/heroes");                 
                }
            })
            .catch(err => {
                console.log(err); 
            });
        }else{
            setSelectedHeroe({id, nombre, poder, estado});
            axios.post(endpoint + '/heroes.json', selectedHeroe)
                .then( res => {
                selectedHeroe.id = res.data.name;
                axios.put(endpoint + '/heroes/' + res.data.name + '.json', selectedHeroe)
                if(res.data){
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "El Heroe ha sido creado correctamente.",
                        showConfirmButton: false,
                        timer: 1500
                    });                    
                    navigate("/heroes");
                }
            })
            .catch(err => {
                console.log(err); 
            }); 
        }
    } 

    return ( 
        <div>
            {nombre !== ''
                ? <h1>Heroe: <small>{nombre}</small></h1>
                : <h1>Heroe: <small>Nombre del heroe</small></h1>
                
            }
            <hr></hr>
            <div className="row text-right">
                <div className="col">
                    <Link to="/heroes" className="btn btn-outline-primary" title="Volver"><FontAwesomeIcon icon="arrow-left" title="Volver" /> Volver </Link>
                </div>
            </div>   
            <div className="row">
                <div className="col">
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label>Id Firebase</label>
                            <input type="text" className="form-control" placeholder="Id Firebase" defaultValue={id} name="id" disabled />
                            <small className="form-text text-muted">Este campo se genera automaticamente.</small>
                        </div>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input type="text" className="form-control" placeholder="Nombre" value={selectedHeroe.nombre} onChange={handleOnChangeNombre} name="nombre" required />
                        </div>
                        <div className="form-group">
                            <label>Poder</label>
                            <input type="text" className="form-control" placeholder="Poder" value={selectedHeroe.poder} onChange={handleOnChangePoder} name="poder" />
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <br></br>
                            {estado === true 
                                ? <button className="btn btn-outline-success w-25 mr-2" type="button" id="Vivo" value={selectedHeroe.estado} onClick={handleOnChangeEstado} ><FontAwesomeIcon icon="thumbs-up" title="Vivo" /> Vivo </button>                                   
                                : <button className="btn btn-outline-danger w-25 ml-2" type="button" id="Muerto" value={selectedHeroe.estado} onClick={handleOnChangeEstado}><FontAwesomeIcon icon="thumbs-down" title="Muerto" /> Muerto </button>
                            }
                        </div>
                        <hr></hr>
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-outline-primary w-25" title="Guardar"><FontAwesomeIcon icon="save" title="Guardar" /> Guardar </button>
                        </div>
                    </form>
                </div>
            </div>                               
        </div>  
     );
}
 
export default HeroeComponent;
