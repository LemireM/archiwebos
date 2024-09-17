class Category {

    constructor(category){
        this.category = category
    }

    render(){
        const element = document.createElement('li')
        element.innerHTML = `<a href=''>${this.category.name}</a>`
        element.dataset.id = this.category.id
        return element
    }

}

export default Category;