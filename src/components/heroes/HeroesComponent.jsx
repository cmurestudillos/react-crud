import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import HeroeModel from '../../models/Heroe';
import Swal from 'sweetalert2';

const HeroesComponent = () => {
    const endpoint = 'https://crud-frameworks-default-rtdb.europe-west1.firebasedatabase.app';
    const [heroes, setHeroes] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        getHeroes();
    }, []);

    const getHeroes = () => {
        setCargando(true);
        axios.get(endpoint + '/heroes.json')
        .then(res => {
            if(res.status === 200){
                heroesArray(res.data);
                setCargando(false);
            }
        });
    }; 

    const heroesArray = (heroesObj) => {
        const heroesData = [];
        if(heroesObj === null){
            return [];
        }

        Object.keys(heroesObj).forEach( key => {
            let heroe = new HeroeModel("", "", "", "");
            heroe = heroesObj[key];
            heroesData.push(heroe);
        });
        setHeroes(heroesData);
    };

    const borrarHeroe = (heroeId) =>{
        Swal.fire({
            title: "¿Estas seguro?",
            text: "Una vez eliminado, no podrá recuperar este archivo.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(endpoint + '/heroes/' + heroeId + '.json')
                    .then(res => {
                        if(res.status === 200){
                            getHeroes();
                        }
                    });
                } else {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Tu archivo esta seguro.",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
        }); 
    };  

    return ( 
        <>
            <h1>Listado de Heroes</h1>
            <hr></hr>
            <div className="row">
                <div className="col text-right">
                    <Link to="/heroe/nuevo" className="btn btn-outline-primary" title="Alta"><FontAwesomeIcon icon="plus" /> Nuevo </Link>
                </div>
            </div>

            {cargando === false &&
                <table className="table mt-3">
                    <thead className="bg-custom">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Poder</th>
                            <th scope="col">Estado</th>
                            <th scope="col" colSpan="2" className="text-center">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {heroes.map( (heroe) => 
                            <tr key={heroe.id}>
                                <td>{heroe.nombre}</td>
                                <td>{heroe.poder}</td>
                                <td>
                                    {heroe.estado === true &&
                                        <FontAwesomeIcon icon="thumbs-up" className="text-success fa-2x" title="Vivo" />
                                    }
                                    {heroe.estado === false &&
                                        <FontAwesomeIcon icon="thumbs-down" className="text-danger fa-2x" title="Muerto" />
                                    }                                        
                                </td>
                                <td className="text-center">
                                    <Link to={'/heroe/' + heroe.id} className="btn btn-outline-warning mr-1" title="Modificar"><FontAwesomeIcon icon="edit" /></Link>
                                    <button className="btn btn-outline-danger" onClick={() => borrarHeroe(heroe.id)} title="Eliminar"><FontAwesomeIcon icon="trash" /></button>
                                </td>
                            </tr>                                 
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5" className="bg-custom"><span><i>Copyright© - Carlos Mur</i></span></td>
                        </tr>
                    </tfoot>
                </table> 
            }

            {cargando === false && heroes === '' &&
                <div className="alert alert-warning text-center mt-3">
                    <h4 className="alert-heading">No hay registros</h4>
                    <p><FontAwesomeIcon icon="exclamation" className="fa-2x" /></p>
                </div>                
            }

            {cargando === true &&
                <div className="alert alert-info text-center mt-3">
                    <h4 className="alert-heading">Cargando</h4>
                    <p><FontAwesomeIcon icon="spinner" className="fa-2x" /></p>
                    <p className="mb-0">Espere por favor...</p>
                </div>                
            }
        </>
     );
}
 
export default HeroesComponent;
