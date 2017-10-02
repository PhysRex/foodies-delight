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
		this.addRecipeAPI = this.addRecipeAPI.bind(this);
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
		localStorage.setItem("recipes", JSON.stringify(recipesArrays));
		this.setState({recipes: recipesArrays}, () => {
			const lastIndex = recipesArrays.length-1;
			this.chooseRecipe(lastIndex);
			// if (recipesArrays[lastIndex] && recipesArrays[lastIndex].temp) {
			// 	setTimeout(this.deleteRecipe(lastIndex),3000);
			// }
		});
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
		// press "submit" button
		const newRecipe = {
			title: this.state.title,
			description: this.state.description,
			ingredients: this.state.ingredients,
			steps: this.state.steps,
		};
		const newRecipes = this.state.recipes.slice()
		newRecipes.splice((edit)?edit:newRecipes.length, 1, newRecipe);
		
		if(newRecipe.title !== "" && newRecipe.ingredients !== "") {
			this.storeRecipes(newRecipes);
			this.showModal();	
			this.clearContents();
		} else {
			this.setState({required: true});
		}
		
		this.setState({edit:false});		
	}

	addRecipeAPI(obj, temp) {
		const recipe = obj.recipe;
		const description = "#" + recipe.healthLabels.join(", #");

		const newRecipe = {
			title: recipe.label,
			description: description,
			ingredients: recipe.ingredientLines.join(","),
			steps: false,
			link: recipe.url,
			linkName: recipe.source,
			temp: temp
		};
		const newRecipes = this.state.recipes.slice();
		newRecipes.push(newRecipe);
		this.storeRecipes(newRecipes);

	}

	chooseRecipe(current) {
		// choose recipe to display in "Recipe" panel
		// if (API===true) {
		// 	this.addRecipeAPI(current, API);
		// } else {
			
		// }
		this.setState({current: current});
	}
	
	editRecipe(number) {
		// replace with edited version
		
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
		
		if (!this.state.recipes[number].steps) {
			this.setState({
				steps: this.state.recipes[number].link,
			});
		}
		
	}
	
	deleteRecipe(number) {
		var newRecipes = this.state.recipes.slice();
		newRecipes.splice(number, 1);
		this.setState({recipes: newRecipes});
		
		this.storeRecipes(newRecipes);
	}

	deleteTemp() {
		let newRecipes = [];
		this.state.recipes.forEach((recipe)=>{
			if (!recipe.temp) {
				// Keep Recipe
				newRecipes.push(recipe);
			} else {
				// Delete recipe
			}
		});
		this.storeRecipes(newRecipes);
		return newRecipes;
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
									addRecipeAPI={(obj, api)=>this.addRecipeAPI(obj, api)}
									editRecipe={(current)=>this.editRecipe(current)}
									deleteRecipe={(current)=>this.deleteRecipe(current)}
									deleteTemp={()=>this.deleteTemp()}
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
			search: "",
			recipesAPI: {}
    }
    this.filterRecipes = this.filterRecipes.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
		this.recipeAPI = this.recipeAPI.bind(this);
		this.allRecipes = this.allRecipes.bind(this);
	}
	
	deleteRecipe(event) {
		const num = Number(event.target.parentNode.parentNode.classList[1].slice(2));
		this.props.deleteRecipe(num);
	}
	
	editRecipe(event) {
		const num = Number(event.target.parentNode.parentNode.classList[1].slice(2));
		this.props.editRecipe(num);
	}

	addRecipeAPI(event, temp) {
		const num = Number(event.target.parentNode.parentNode.classList[1].slice(6));
		const newRecipe = this.state.recipesAPI.hits[num];
		this.props.addRecipeAPI(newRecipe, temp);
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
	
	clickedAPI(event) {
		var num, temp = true;
		if (event.target.classList.contains("btn-save")) {

			// FIXME: INELEGANT SOLUTION TO CHANGE LASS AND ADD TEXT TO CLICKED BUTTON... LOOK FOR BETTER SOLUTION!
			const id = event.target.id;
			const btnElem = document.getElementById(id);
			btnElem.classList.add("btn-success");
			btnElem.innerText = "Added!";
			temp = false;

			num = Number(event.target.parentNode.parentNode.classList[1].slice(6));
		} else if (event.target.classList.contains("list-group-item")) {
			num = Number(event.target.classList[1].slice(6));
		} else {
			num = Number(event.target.parentNode.classList[1].slice(6));
		}
		
		const newRecipe = this.state.recipesAPI.hits[num];
		this.props.addRecipeAPI(newRecipe, temp);
	}
  
  filterRecipes(event) {
    // Filter recipe book

		event.preventDefault();
    
		// dynamically update State with values of input fields		
		const value = event.target.value;
		const name = event.target.name;
		
		// call recipe API to search for external recipes
		this.recipeAPI(value);
    
    var recipes = this.props.recipes.slice();
    var filterList = this.props.recipes.slice();
    this.setState({[name]: value}, () => {
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
		const newRecipes = this.props.deleteTemp();
    this.setState({
      search: "",
			recipes: newRecipes,
			recipesAPI: {}
		});
	}

	recipeAPI(query) {
		const app_id = "ac2807b8";
		// const app_key = "af6c26685971c69e44b7de2b4342d3ce";
		const app_key = "ddb0d451c4388da41cd0fd043654f23c";
		const recipeURL	= 
			"https://api.edamam.com/search?q=" + query + 
			"&app_id=" + app_id + "" + 
			"&app_key=" + app_key + "";

		// let headers = new Headers({
		// 	'Access-Control-Allow-Origin':'',
		// 	'Content-Type': 'text/xml'
		// });

		// var myInit = { 
		// 	method: 'GET',
		// 	headers: headers,
		// 	mode: 'cors',
		// 	cache: 'default' };
		fetch(recipeURL) // Call the fetch function passing the url of the API as a parameter
			.then( (response) => { 
			if (!response.ok) {
				throw Error("Network Request Failed");
			}
			return response
			})
			.then( (response) => response.json() ) // change data into JSON
			.then( (response) => this.allRecipes(response)
			
			);

	}

	allRecipes(obj) {
		this.setState({
			recipesAPI: obj
		});
	}

	getWeather() {
		// const query = "chicken"
		// const app_id = "ac2807b8";
		// const app_key = "af6c26685971c69e44b7de2b4342d3ce";
		// const recipeURL	= 
		// 	"https://api.edamam.com/search/q=" + query + 
		// 	"&app_id=" + app_id + "" + 
		// 	"&app_key=" + app_key + "";
		// 	console.log("URL: ", recipeURL);
			

		const query = "chicken";
		const app_key = "fc321b8c2e2be585c60a28d278aa34f9";
		const searchURL	= 
			"http://food2fork.com/api/search?key=" + app_key + "&q=" + query;
			console.log("URL: ", searchURL);
		// const recipeURL	= 
		// 	"http://food2fork.com/api/search/key=" + app_key + 
		// 	"&rId=" + recipeID;
		// 	console.log("URL: ", recipeURL);

	
		var request = new XMLHttpRequest();
		// request.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=9109e43ce9bf3d94ec86481f37d3fd14", true);
		request.open("GET", searchURL, true);
		request.setRequestHeader('Access-Control-Allow-Origin','*',);
		request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
		request.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
		request.send();

		request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
				// raw JSON response from server request
				var data = request.responseText;
				// console.log("data: ",data);

				// parsed JSON response -> javascript object
				var dataObj = JSON.parse(data)
				// console.log("json: ",dataObj);

				// unique pageIDs from search results
				var keys = Object.keys(dataObj);
				// console.log("keys: ",keys);
				
				console.log(dataObj);
			}
		}
	}

  componentWillMount() {
    this.setState({
      recipes: this.props.recipes
		});
		
  }
	
	render() {
		const list = (this.state.search.length>0)?this.state.recipes:this.props.recipes;
		let panel = list.map( (recipeElem, i)=>{
			return (
				<a key={"no" + this.props.recipes.indexOf(recipeElem)} href="#" className={"list-group-item " + "no"+this.props.recipes.indexOf(recipeElem)} onClick={(e)=>this.clicked(e)}>
					<div className="btn-group">
						<button className="btn btn-warning btn-xs btn-edit">edit</button>
						<button className="btn btn-danger btn-xs btn-delete">x</button>
					</div>
					<span className="badge">Ingredients: {recipeElem.ingredients.split(",").length}</span>
					<h4 className="list-group-item-heading">{recipeElem.title}</h4>
					<p className="list-group-item-text">{recipeElem.description}</p>
				</a>
			);
		});

		var ingredientsNumber, title, description, key=0;
		var listAPI = this.state.recipesAPI;
		let panelAPI = [];
		if ((listAPI) && Object.keys(listAPI).length !== 0 && listAPI.constructor === Object) {
			for (var recipe of listAPI.hits) {				
				ingredientsNumber = recipe.recipe.ingredients.length;
				title = recipe.recipe.label;
				description = "#" + recipe.recipe.healthLabels.join(", #");
				panelAPI.push(
					<a key={"API_no"+key} href="#" className={"list-group-item " + "API_no"+key + " list-group-item-api"} onClick={(e)=>this.clickedAPI(e)}>
						<div className="btn-group">
							<button className="btn btn-primary btn-xs btn-save" onClick={this.changeBtnClass} id={"API_Btn_"+key}>save recipe</button>
						</div>
						<span className="badge">Ingredients: {ingredientsNumber}</span>
						<h4 className="list-group-item-heading">{title}</h4>
						<p className="list-group-item-text">{description}</p>
					</a>
				);
				key+=1;
			}
		} else if (this.state.search.length>0) {
			panelAPI.push(
				<a key={"API_no0"}  href="#" className="list-group-item list-group-item-api">
					<h4 className="list-group-item-heading">Searching...</h4>
				</a>
			);
		}

		panel = panel.concat(panelAPI);

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

			if (this.props.recipe.steps) {
				steps = this.props.recipe.steps.split(",").map((step,index)=> {
					return  (
						<li key={index} className="output-steps">{step}</li>
						);
				});
			} else {
				steps = <p className="output-steps">Visit <a href={this.props.recipe.link}>{this.props.recipe.linkName}</a> for full recipe!</p>
			}
		
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
