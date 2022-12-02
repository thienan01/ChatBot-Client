import { Form} from "react-bootstrap"



const AddForm = ({
    handleAddFormSubmit,
    handleAddFormChange,
}) =>{

    
     return (

        <Form onSubmit={handleAddFormSubmit}>
        <Form.Group>
            <Form.Control
               type="text"
               name="name"
               required="required"
               placeholder="Enter a name..."
               onChange={handleAddFormChange}
            />
        </Form.Group>
        <br />
        <Form.Group>
            <Form.Control
                type="text"
                name="code"
                required="required"
                placeholder="Enter a code..."
                onChange={handleAddFormChange}
            />
        </Form.Group>
        <br/>
    </Form>


     )
}

export default AddForm;