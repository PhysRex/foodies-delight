import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Resources
/*
https://www.robinwieruch.de/local-storage-react/
https://codepen.io/ThePixelPixie/pen/oLmbLP?editors=0100
http://lea.verou.me/css3patterns/#madras
*/


class App extends React.Component {	
	constructor(props) {
		super(props);
		this.state = {
			current: 0,  // determines which recipe to display
			modal: false, // determines whether to show modal or not
			edit: false, // becomes number of recipe to edit in modal
			title: "",
			description: "",
			ingredients: "",
			steps: "",
			time: "",
			tags: "",
			required: false, // determines if required class should activate w/in modal
			recipes: [
				{title: "roast duck", description: "A delicious platter for a great night in", ingredients: "duck, glaze, rice, oven", steps: "preheat over to 325F, cut duck, drizzle with glaze, put into oven, make rice, serve together"}, 
				{title: "orange chicken", description: "Sweet and succulent white meat dish", ingredients: "drumsticks, oranges, grill", steps: " preheat grill to 350F, slice oranges in half, glaze chicken, heat for 30 min, serve warm"}, 
        {title: "cool salad", description: "Healthy and filling vegetables", ingredients: "carrots, tomatoes, baby lettuce, spinach, kale, cucumbers, fetta, salt, pepper", steps: "slice all veggies, add salt, boil spinach, mix, serve cool"}
      ]
		};
		
		
		this.loadRecipes = this.loadRecipes.bind(this);
		this.storeRecipes = this.storeRecipes.bind(this);
		this.addRecipe = this.addRecipe.bind(this);
		this.submitRecipe = this.submitRecipe.bind(this);
		this.chooseRecipe = this.chooseRecipe.bind(this);
		this.editRecipe = this.editRecipe.bind(this);
		this.deleteRecipe = this.deleteRecipe.bind(this);
		this.showModal = this.showModal.bind(this);
		this.clearContents = this.clearContents.bind(this);
	}
	
	loadRecipes() {
		// get recipes and load into State if they exist in local storage
		const cachedRecipes = localStorage.getItem("recipes");
		if (cachedRecipes) {
			this.setState({recipes: cachedRecipes});
		}
		
	}
	
	storeRecipes(recipesArrays) {
		
		// store recipes in State and Local Storage
		this.setState({ recipes: recipesArrays});
    localStorage.setItem("recipes", JSON.stringify(recipesArrays));
	}

  addRecipe(event) {
		// dynamically update State with values of input fields
		event.preventDefault();
		const value = event.target.value;
		const name = event.target.name;
		
		this.setState({[name]: value})
  }
	
	submitRecipe(event, edit=this.state.edit) {
		event.preventDefault();
		// presss "submit" button
		const newRecipe = {
			title: this.state.title,
			description: this.state.description,
			ingredients: this.state.ingredients,
			steps: this.state.steps,
		};
		const newRecipes = this.state.recipes.slice()
		newRecipes.splice((edit)?edit:newRecipes.length, 1, newRecipe);
		
		if(newRecipe.title !== "" && newRecipe.ingredients !== "") {
			this.storeRecipes(newRecipes, edit);
			this.showModal();	
			this.clearContents();
		} else {
			this.setState({required: true});
		}
		
		this.setState({edit:false});
		
	}
	
	chooseRecipe(current) {
		// choose recipe to display in "Recipe" panel
		this.setState({current: current});
	}
	
	editRecipe(number) {
		this.showModal(number);
		this.setState({
				title: this.state.recipes[number].title,
				description: this.state.recipes[number].description,
				ingredients: this.state.recipes[number].ingredients,
				steps: this.state.recipes[number].steps,
				modal: true, 
				required: false,
				edit: number
			});
		
		// replace with edited version
		// this.deleteRecipe(number);
	}
	
	deleteRecipe(number) {
		var newRecipes = this.state.recipes.slice();
		newRecipes.splice(number, 1);
		this.setState({recipes: newRecipes});
		
		this.storeRecipes(newRecipes);
	}
	
	showModal(event) {
		// "add recipe" button
		 if (typeof event==="number") {
			this.setState({
				modal: true,
				required: false
			});
		} else if (event===undefined || event.target.classList.contains("modal-hide")) {
      this.clearContents();
			this.setState({modal: false, required: false});
		} else if (event.target.classList.contains("add-modal")) {
			this.setState({modal: true, required: false});
		}
	}

	clearContents() {
		// "cancel" button
		this.setState({
			title: "",
			description: "",
			ingredients: "",
			steps: "",
		})
  }

	componentWillMount() {
		// Called the first time the component is loaded right before the component is added to the page
		
		// set state from local storage
		const cachedRecipes = localStorage.getItem("recipes");
		if (cachedRecipes && JSON.parse(cachedRecipes).length>0) {
			this.setState({ recipes: JSON.parse(cachedRecipes) });
			return;
		} else {
			localStorage.setItem("recipes", JSON.stringify(this.state.recipes));
		}
		
	}
	
	
	render() {
		
		const modal = 
					<div 
						className={"container-fluid modal modal-hide " + (this.state.modal? "show":"")} 
						onClick={this.showModal}>
						<div className="row modal-hide">
							<div className="col-xs-offset-1 col-xs-10 col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 modal-hide">

								<div className="panel panel-success panel-modal">
									<div className="panel-heading">New Recipe!</div>
									<div className="panel-body">
										<form className="text-left" onSubmit={this.submitRecipe}>
											<div className="form-group">
												<label htmlFor="title">Title<small className={this.state.required?"panel-req":""}>*</small>:</label>
												<input 
													type="text" 
													name="title" 
													className="form-control" 
													id="input-title" 
													placeholder="Recipe Name"
													value={this.state.title}
													onChange={this.addRecipe}/>
											</div>
											<div className="form-group">
												<label htmlFor="description">Description:</label>
												<input 
													type="text" 
													name="description" 
													className="form-control" 
													id="input-description" 
													placeholder="Description of dish" 
													value={this.state.description}
													onChange={this.addRecipe}/>
											</div>
											<div className="form-group">
												<label htmlFor="ingredients">Ingredients<small className={this.state.required?"panel-req":""}>*</small>:</label>
												<input 
													type="text" 
													name="ingredients" 
													className="form-control" 
													id="input-ingredients" 
													placeholder="Ingredients, separated by commas (ex: pears, honey, berries)" 
													value={this.state.ingredients}
													onChange={this.addRecipe}/>
											</div>
											<div className="form-group">
												<label htmlFor="steps">Steps:</label>
												<input 
													type="text" 
													name="steps" 
													className="form-control" 
													id="input-steps" 
													placeholder="Steps, separated by commas (ex: slice pears, ...)" 
													value={this.state.steps}
													onChange={this.addRecipe}/>
												<small className={this.state.required?"panel-req":""}>*required</small>
											</div>
											<div className="btn-justify text-center">
												<button type="submit" className="btn btn-primary btn-pad btn-submit">Submit</button>
												<button type="button" className="btn btn-danger btn-pad " onClick={this.clearContents}>Reset</button>
											</div>
										</form>
									</div>
								</div>

							</div>		
						</div>
					</div>;
		
		return (
			<div className="container-fluid">
				<h1 className="title">Foodies Delight</h1>
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-12">
						{modal}
					</div>
				</div>
				<div className="row">
					<div className="col-md-1 col-lg-2"></div>
					<div className="col-xs-12 col-sm-6 col-md-5 col-lg-4">
						<div className="row">
							<h3 className="subtitle">
                Recipe Book
								<button className="btn btn-success btn-xs btn-pad add-modal" onClick={this.showModal}>
									add recipe
								</button>
							</h3>
							<div className="child-component col-sm-12">
								<List 
									recipes={this.state.recipes} 
									click={(current)=>this.chooseRecipe(current)}
									editRecipe={(current)=>this.editRecipe(current)}
									deleteRecipe={(current)=>this.deleteRecipe(current)}
									/>
							</div>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-5 col-lg-4">
						<div className="row">
							<h3 className="subtitle">Recipe</h3>
							<div className="child-component col-sm-12">
								<Recipe 
									recipe={
										(this.state.current<this.state.recipes.length)?
											this.state.recipes[this.state.current]:
										this.state.recipes[this.state.current-1]}/>
							</div>
						</div>
					</div>
					<div className="col-md-1 col-lg-2"></div>
				</div>
			</div>
		);
	}
	
}

class List extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      search: ""
    }
    this.filterRecipes = this.filterRecipes.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
	}
	
	deleteRecipe(event) {
		var num = Number(event.target.parentNode.parentNode.classList[1].slice(2));
		this.props.deleteRecipe(num);
	}
	
	editRecipe(event) {
		var num = Number(event.target.parentNode.parentNode.classList[1].slice(2));
		this.props.editRecipe(num);
	}
	
	clicked(event) {
		var num;
		if (event.target.classList.contains("btn-delete")) {
			return this.deleteRecipe(event);
		} else if (event.target.classList.contains("btn-edit")) {
			return this.editRecipe(event);
		} else if (event.target.classList.contains("list-group-item")) {
			num = Number(event.target.classList[1].slice(2));
		} else {
			num = Number(event.target.parentNode.classList[1].slice(2));
		}
		
		this.props.click(num);		
	}
  
  filterRecipes(event) {
    // Filter recipe book

    event.preventDefault();
    
		// dynamically update State with values of input fields		
		const value = event.target.value;
		const name = event.target.name;
    
    var recipes = this.props.recipes.slice();
    var filterList = this.props.recipes.slice();
    this.setState({[name]: value}, ()=> {
      // Declare variables
      var title;
      var filter = this.state.search.toLowerCase();
      
      // Loop through all list items, and hide those who don't match the search query
      for (var i = recipes.length-1; i >=0 ; i--) {
        title = recipes[i].title;
        if (title.toLowerCase().indexOf(filter) < 0) {
          // hide item
          filterList.splice(i,1);
        }
      }
      this.setState({
        recipes: filterList
      });
      
    });
    
  }

  clearSearch() {
    this.setState({
      search: "",
      recipes: this.props.recipes
    });
  }

  componentWillMount() {
    this.setState({
      recipes: this.props.recipes
    })
  }

	componentWillReceiveProps(nextProps) {
		// Called when the props provided to the component are changed
    // console.log("props", nextProps);
    // this.clearSearch();
	}
	
	render() {
    const list = (this.state.search.length>0)?this.state.recipes:this.props.recipes;
    // const list = this.state.recipes;
		const panel = list.map( (elems, i)=>{			
			return (
				<a key={"no" + i} href="#" className={"list-group-item " + "no"+i} onClick={(e)=>this.clicked(e)}>
					<div className="btn-group">
						<button className="btn btn-warning btn-xs btn-edit">edit</button>
						<button className="btn btn-danger btn-xs btn-delete">x</button>
					</div>
					<span className="badge">Ingredients: {elems.ingredients.split(",").length}</span>
					<h4 className="list-group-item-heading">{elems.title}</h4>
					<p className="list-group-item-text">{elems.description}</p>
				</a>
			);
		});
		
		return (
			<div className="container-fluid">
        <div className="form-group">
          <label className="sr-only" htmlFor="inputSearchText">Text for Recipe Search</label>
          <div className="input-group">
            {/* <div className="input-group-addon">Search</div> */}
            <input autoFocus
            type="text"
            name="search"
            className="form-control"
            placeholder="Search For Recipe"
            value={this.state.search}
            onChange={this.filterRecipes} />
            <div className="input-group-addon" id="clearSearch" onClick={this.clearSearch}>&times;</div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">					
            <div className="panel-group" >
              <div className="panel panel-warning" id="recipePanel">
                <div className="list-group text-left" id="recipeBook">
                  {panel}
                </div>
              </div>
            </div>						
          </div>
				</div>
			</div>
		);
	}
	
}

class Recipe extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
    var steps, panel;
    if (this.props.recipe) {
      steps = this.props.recipe.steps.split(",").map((step,index)=> {
        return  (
          <li key={index} className="output-steps">{step}</li>
          );
      });
		
		panel = 
				<div className="panel panel-warning text-left">
					<div className="panel-heading output-title">{this.props.recipe.title}</div>
					<div className="panel-body">
						<p className="output-description">{this.props.recipe.description}</p>
						<h4>Steps</h4>
						<ol>{steps}</ol>
						<h4>Ingredients</h4>
						<p className="output-ingredients">{this.props.recipe.ingredients}</p>
						</div>
        </div>;
              
    } else {
      panel = 
        <div className="panel panel-warning text-center">
          <div className="panel-heading output-title">
            <em>Add your own recipe!</em>
          </div>          
        </div>;
    }
		
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm-12">
					
						<div className="panel-group">
							{panel}
						</div>
						
					</div>
				</div>
			</div>
		);
	}
	
}


// ReactDOM.render(<Home />, document.getElementById("app"));

export default App;
