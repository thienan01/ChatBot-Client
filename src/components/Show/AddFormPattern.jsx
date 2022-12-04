import { Form} from "react-bootstrap"



const AddFormPattern = ({
    handleAddFormSubmit,
    handleAddFormChange,
}) =>{

    
     return (

        <Form onSubmit={handleAddFormSubmit}>
        <Form.Group>
            <h5>Content</h5>
            <Form.Control
               type="text"
               name="content"
               required="required"
               placeholder="Enter a content..."
               onChange={handleAddFormChange}
            />
        </Form.Group>
        <br />
        <br/>
    </Form>


     )
}

export default AddFormPattern;