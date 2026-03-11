import React, { useState, useEffect, useRef } from "react";
import { Galleria } from "primereact/galleria";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import { Helmet } from "react-helmet";

function Gallery() {

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetAllGalleryDate();
  }, []);

  const GetAllGalleryDate = () => {
    axios.post(URLS.GetAllGallery, {}, {}).then((res) => {
      if (res.status === 200) {
        setImages(res.data.gallerys);
        setIsLoading(false);
      }
    });
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const galleria = useRef(null);

  const itemTemplate = (item) => {
    return (
      <img
        src={URLS.Base + item.image}
        alt={item.alt}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "75vh",
          objectFit: "contain"
        }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={URLS.Base + item.image}
        alt={item.alt}
        style={{ display: "block" }}
      />
    );
  };

  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 5
    },
    {
      breakpoint: "768px",
      numVisible: 3
    },
    {
      breakpoint: "560px",
      numVisible: 1
    }
  ];

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Private Theater for Birthdays & Anniversaries | Carnival Castle
        </title>
        <meta
          name="description"
          content="Looking for a unique celebration venue in Hyderabad? Carnival Castle offers luxury private theaters with Lavish decor & food options for any special occasion."
        />
      </Helmet>

      {isLoading ? (
        <div
          className="text-center"
          style={{
            backgroundColor: "var(--charcoal-black)",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div>
            <img
              src="assets/img/gipss.gif"
              style={{ height: "300px" }}
              alt="loading"
            />
            <h6 style={{ color: "gold" }}>Loading...</h6>
          </div>
        </div>
      ) : (
        <div className="home-page indexsix">

          <Header />

          <main className="main-wrapper">

            {/* HERO */}

            <section
              id="parallax"
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix lighter-back"
              style={{ backgroundColor: "#AD3DF0" }}
            >
              <div className="container-md">
                <div className="row">
                  <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                    <div className="breadcrumb-wrap text-center">
                      <div className="breadcrumb-title mb-30 dark-text">
                        <h1 style={{ marginTop: "5px" }}>Gallery</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* GALLERY */}

            <section
              className="shop-area pt-3 pb-4 p-relative lighter-back"
            >

              <div className="container-md">

                <Galleria
                  ref={galleria}
                  value={images}
                  responsiveOptions={responsiveOptions}
                  numVisible={7}
                  activeIndex={activeIndex}
                  onItemChange={(e) => setActiveIndex(e.index)}
                  circular
                  fullScreen
                  showItemNavigators
                  showThumbnails={false}
                  item={itemTemplate}
                  thumbnail={thumbnailTemplate}
                />

                <div className="row">

                  {images.map((image, index) => (

                    <div
                      className="col-lg-4 col-md-6 col-sm-12 mb-4"
                      key={index}
                    >

                      <div
                        className="gallery-card"
                        onClick={() => {
                          setActiveIndex(index);
                          galleria.current.show();
                        }}
                      >

                        <img
                          src={URLS.Base + image.image}
                          alt={image.alt}
                          className="gallery-img"
                        />

                        <div className="zoom-overlay">
                          <i className="fas fa-search-plus"></i>
                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </section>

          </main>

          <Footer />

        </div>
      )}

      {/* CSS */}

      <style>{`

      .gallery-card{
        position:relative;
        overflow:hidden;
        border-radius:16px;
        cursor:pointer;
        box-shadow:0 8px 25px rgba(0,0,0,0.12);
        transition:all .3s ease;
        background:#fff;
      }

      .gallery-card:hover{
        transform:translateY(-5px);
      }

      .gallery-img{
        width:100%;
        height:460px;
        object-fit:cover;
        transition:transform .4s ease;
      }

      .gallery-card:hover .gallery-img{
        transform:scale(1.1);
      }

      .zoom-overlay{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        background:rgba(0,0,0,0.35);
        color:white;
        font-size:30px;
        opacity:0;
        transition:opacity .3s ease;
      }

      .gallery-card:hover .zoom-overlay{
        opacity:1;
      }

      .p-galleria-item img{
  width:100%;
  height:auto;
  max-height:80vh;
  object-fit:contain;
}

      `}</style>

    </>
  );
}

export default Gallery;