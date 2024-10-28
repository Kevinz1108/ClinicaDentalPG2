import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';


export default function CarouselComponent() {
    const [products] = useState([
        { id: 1, image: 'dental1.jpg' },
        { id: 2, name: 'Producto 2', price: 75, image: 'dental2.jpg', inventoryStatus: 'LOWSTOCK' },
        { id: 3, name: 'Producto 3', price: 100, image: 'dental3.jpg', inventoryStatus: 'OUTOFSTOCK' },

    ]);

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];



    const productTemplate = (product) => {
        return (
            <div className="  m-1 text-center ">
                <div className="mb-3">
           
                    <img
                     src={require(`../../../../assets/images/${product.image}`)}
                     alt={product.name}
                     className="w-full  shadow-8"
                     style={{ maxHeight: '38rem', height: 'auto' }}
                     />
                     
                </div>
                <div>
                    
                    
                    
                  
                </div>
            </div>
        );
    };

    return (
        <div className="card scalein animation-duration-1000  ">
            <Carousel
             value={products} 
             numVisible={1} 
             numScroll={1} 
             responsiveOptions={responsiveOptions} 
             className="custom-carousel " 
             circular autoplayInterval={3000} 
             itemTemplate={productTemplate} />
        </div>
    );
}
