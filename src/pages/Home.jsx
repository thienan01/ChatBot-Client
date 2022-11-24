
import React, {useRef} from 'react'
import { Container, Row, Col } from "reactstrap"
import { NavLink } from 'react-router-dom'
import "../styles/home.css"
import Background from '../assets/Background.png';


const nav__links = [
  {
      display: 'Contacs Us',
      path: '/'
  },
  {
      display: 'Support',
      path: '/'
  },
  {
      display: 'My Account',
      path: '/'
  },
  {
    display: 'Sign In',
    path: '/'
},

]

const Home = () => {

  const menuRef = useRef(null)
  const toggleMenu = () => menuRef.current.classList.toggle('show__menu')

  return (
    
    <div className='homePage'>
    
    <div className='container__header'>
      
      <div className='header'>
        
      
          <div className='header__nav'>
            <div className='header__navMenu'>
            {
          nav__links.map((item,index)=>(
                       
                        <NavLink 
                        onClick={toggleMenu}
                        to={item.path} 
                        key={index}
                        className={navClass => 
                            navClass.isActive ? 'active__menu' : ""}
                        >
                            {item.display}
                            </NavLink>
                    ))
              }
              </div>

              <div className='header__option'>
                  
                  <span className='header__createAccount'>Create Account</span>     
                  
                </div> 
            </div>
        </div>
      <div className='header__feature'>
      
  

        <div className='header__featureContainer'> 
          
        <div className='header__featureContainerOption'>
            <span>Overview</span>  
        </div>

        <div className='header__featureContainerOption'>
            <span>Features</span>  
        </div>

        <div className='header__featureContainerOption'>
            <span>Use Cases</span>  
        </div>

        <div className='header__featureContainerOption'>
            <span>Pricing</span>  
        </div>

        <div className='header__featureContainerOption'>
            <span>Resources</span>  
        </div>

        <div className='header__featureContainerOption'>
            <span>Customers</span>  
        </div>

        <div className='header__featureContainerOption'>
            <span>AI ChatBox</span>  
          </div>

        </div>
    
      </div>
      
      </div>


    <div className='homePage__container'>
        <img className='homePage__img' src={Background} alt="homePageImage"></img>
        <Container>
        <Row>
          
          <Col lg="6" md="6" sm="6" className="m-auto text-center">
            <h4 className='title__chatbox'>AI ChatBox Customer</h4>
            <h1 className='title__chatboxDescription'>Build Chat Box Using The AI API </h1>
            <div className='started__chatbox'>Get Started With AI</div>
          </Col>
   
          <Col lg="6" md="6" sm="6" className="m-auto text-center">
          <p className='homePage__descriptionRightSideText'>Create Voice Call Using API Support For Sale or Provide Service Better</p>
          </Col>
    </Row>
    </Container>
    </div>

</div>
  )
}

export default Home