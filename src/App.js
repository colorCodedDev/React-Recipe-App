import React, { useState, useEffect } from "react";
import { db } from "./firebase.config.js";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { Accordion, Form, Image, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { Button, DialogTitle, DialogContent, DialogActions, Dialog, TextField, FormControl, OutlinedInput } from '@mui/material';

function App() {
  const [recipes, setRecipes] = useState([]);
  const recipeRef = collection(db, 'recipes');
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [formData, setFormData] = useState({ id: "", title: "", description: "", ingredients: "", directions: "", image: "" });
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(recipeRef, snapshot => {
      setRecipes(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })));
    });
    return () => unsubscribe();
  }, [recipeRef]);

  const deleteRecipe = async (id) => {
    const docRef = doc(db, "recipes", id);
    await deleteDoc(docRef);
    console.log("Recipe deleted successfully");
  };

  const handleShowEditModal = (recipe) => {
    setCurrentRecipe(recipe);
    setFormData({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.join(","),
      directions: recipe.directions.join(","),
      image: recipe.image,
    });
    handleShowEdit();
  };

  const handleShowAddModal = () => {
    setFormData({ id: "", title: "", description: "", ingredients: "", directions: "", image: "" });
    setShowAdd(true);
  };

  const updateRecipe = async (e) => {
    e.preventDefault();
    const recipeDoc = doc(db, "recipes", currentRecipe.id);
    await updateDoc(recipeDoc, {
      title: formData.title,
      description: formData.description,
      ingredients: formData.ingredients.split(",").map(item => item.trim()),
      directions: formData.directions.split(",").map(item => item.trim()),
      image: formData.image,
    });
    setShowEdit(false);
  };

  const handleSubmitAddRecipe = async (e) => {
    e.preventDefault();
    await addDoc(recipeRef, {
      title: formData.title,
      description: formData.description,
      ingredients: formData.ingredients.split(",").map(item => item.trim()),
      directions: formData.directions.split(",").map(item => item.trim()),
      image: formData.image,
    });

    setShowAdd(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <header className="header-content">
              <h3 className="heading">React Recipe Box</h3>
              <p className="sub-heading">
                With this app you can create, edit & delete your recipes. Include recipe image, description, ingredients and directions.
                <br />
                This App uses session storage so that a page refresh will keep stored data until the page is closed so remember to save your recipes!
                <br />
                Click on a recipe title to get started, this will toggle the recipe open and closed.
              </p>
            </header>
          </Col>
        </Row>

        <Row>
          <Col>
            {recipes.map((recipe) => (
              <div className="accordions-container" key={recipe.id}>
                <Accordion flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <h3>{recipe.title.toString()}</h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="recipe-flexbox">
                        <div className="inner-image-container">
                          <Image className="recipe-image" src={recipe.image} fluid />
                          <h4 className="description-text">{recipe.description.toString()}</h4>
                        </div>
                        <div className="inner-ingredients-container">
                          <h3>Ingredients</h3>
                          <ul className="ingredients-list">
                            {recipe.ingredients.map((ingredient, j) => (
                              <li key={j}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="inner-directions-container">
                          <h3>Directions</h3>
                          <ol className="directions-list">
                            {recipe.directions.map((direction, k) => (
                              <li key={k}>{direction}</li>
                            ))}
                          </ol>
                          <div className="button-container">
                            <Button className="edit-button" variant="contained" onClick={() => handleShowEditModal(recipe)}>Edit</Button>
                            <Button className="delete-button" variant="contained" onClick={() => deleteRecipe(recipe.id)}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            ))}
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <div className="add-button-container">
              <Button className="add-button" variant="contained" onClick={handleShowAddModal}>Add New Recipe</Button>
            </div>
          </Col>
        </Row>
      </Container>

      <Dialog className="add-recipe-modal" onClose={handleCloseAdd} open={showAdd}>
        <DialogTitle>Add Recipe</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" onSubmit={handleSubmitAddRecipe}>
            <FormControl fullWidth>
              <TextField
                margin="dense"
                name="title"
                label="Title"
                type="text"
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                multiline
                value={formData.description}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="ingredients"
                label="Ingredients"
                type="text"
                fullWidth
                multiline
                value={formData.ingredients}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="directions"
                label="Directions"
                type="text"
                fullWidth
                multiline
                value={formData.directions}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="image"
                label="Image URL"
                type="text"
                fullWidth
                value={formData.image}
                onChange={handleChange}
              />
            </FormControl>
            <DialogActions>
              <Button onClick={handleCloseAdd}>Cancel</Button>
              <Button onClick={handleSubmitAddRecipe} type="submit">Add</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog className="edit-recipe-modal" open={showEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Recipe</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" onSubmit={updateRecipe}>
            <FormControl fullWidth>
              <TextField
                margin="dense"
                name="title"
                label="Title"
                type="text"
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                multiline
                value={formData.description}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="ingredients"
                label="Ingredients"
                type="text"
                fullWidth
                multiline
                value={formData.ingredients}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="directions"
                label="Directions"
                type="text"
                fullWidth
                multiline
                value={formData.directions}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="image"
                label="Image URL"
                type="text"
                fullWidth
                value={formData.image}
                onChange={handleChange}
              />
            </FormControl>
            <DialogActions>
              <Button onClick={handleCloseEdit}>Cancel</Button>
              <Button onClick={updateRecipe} type="submit">Submit</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;