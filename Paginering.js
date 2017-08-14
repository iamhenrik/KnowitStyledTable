class Paginering {
    //legger inn antall entries per side som argument i konstruktøren
    constructor(entriesPerPage){
        this.repositories = [];
        this.startPos = 0;
        this.endPos = entriesPerPage;
        this.makeLoadingIcon();
        this.makeTable(entriesPerPage);
        this.makeButtons();
    
    }
    
    //Hentet ferdiglaget loading icon fra http://tobiasahlin.com/spinkit
    makeLoadingIcon(){
        
        this.foldingCube = document.createElement('div');
        this.foldingCube.classList.add('sk-folding-cube');
        document.getElementsByTagName('body')[0].appendChild(this.foldingCube)
        
        this.firstCube = document.createElement('div');
        this.firstCube.classList.add('sk-cube1');
        this.firstCube.classList.add('sk-cube');
        this.foldingCube.appendChild(this.firstCube);
        
        this.secoundCube = document.createElement('div');
        this.secoundCube.classList.add('sk-cube2');
        this.secoundCube.classList.add('sk-cube');
        this.foldingCube.appendChild(this.secoundCube);
        
        this.thirdCube = document.createElement('div');
        this.thirdCube.classList.add('sk-cube3');
        this.thirdCube.classList.add('sk-cube');
        this.foldingCube.appendChild(this.thirdCube);
        
        this.fourthCube = document.createElement('div');
        this.fourthCube.classList.add('sk-cube4');
        this.fourthCube.classList.add('sk-cube');
        this.foldingCube.appendChild(this.fourthCube);
        
    }
 
    makeButtons(){
        this.buttonNext = document.createElement('button');
        this.buttonPrev = document.createElement('button');
        
        //PREVOIUS BUTTON
        document.getElementsByTagName('body')[0].appendChild(this.buttonPrev);
        this.buttonPrev.innerHTML = 'Prev';
        //NEXT BUTTON
        document.getElementsByTagName('body')[0].appendChild(this.buttonNext);
        this.buttonNext.innerHTML = 'Next';
    }
    
    //Viser hvilke entries som vises i tabellen
    makePageNumber(){
        this.pageNumber = document.createElement('div');
        this.pageNumber.id = 'pageNumber';
        document.getElementsByTagName('body')[0].appendChild(this.pageNumber);
        this.startPosPlusOne = this.startPos+1 //plusser på 1 her så ikke første element i tabellen vises som 0 
        this.pageNumber.innerHTML = 'Showing entries: '+this.startPosPlusOne+' - '+this.endPos+' of total: '+this.repositories.length;
    }
    
    removePageNumber(){
        while(this.pageNumber.firstChild){
            this.pageNumber.removeChild(this.pageNumber.firstChild);
        }
    }
    removeLoadingIcon(){
        while(this.foldingCube.firstChild){
            this.foldingCube.removeChild(this.foldingCube.firstChild);
        }
    }
    
    makeTable(entriesPerPage){
        const url = 'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=100'
        /*//Refererer her til det "ytre" objectet og ikke funksjonsobjektet under*/
        var that = this;
        axios.get(url).then(response => { //Bruker axios til å hente JSON data
            that.repositories = response.data.items; 
            
            that.table = document.createElement("table");
            that.table.classList.add('tbl-content');
            that.table.id = 'tableOfRepos';
            document.getElementsByTagName('body')[0].appendChild(that.table); //Legger til table til html-tag'en body.
            
            that.makeTableHeader(); 
            
            that.buttonNext.addEventListener('click', function(event){ 
                //if setning som hindrer at endPos og startPos ikke går under 0 eller over repositories.length
                if(that.endPos < that.repositories.length){
                    var table = document.getElementById('tableOfRepos');
                    while(table.rows.length > 0) {
                        table.deleteRow(0);
                    }

                    that.startPos += entriesPerPage; //logikk for paginering
                    that.endPos += entriesPerPage;

                    that.makeTableHeader();
                    that.makeTableContent();
                    that.removePageNumber();
                    that.makePageNumber();
                }
            });
            
            that.buttonPrev.addEventListener('click', function(event){
                //if setning som hindrer at endPos og startPos ikke går under 0 eller over repositories.length
                if(that.startPos > 0){
                    //fjerner radene som ikke skal vises
                    var table = document.getElementById('tableOfRepos');
                    while(table.rows.length > 0) {
                        table.deleteRow(0);
                    }
                    that.startPos -= entriesPerPage; 
                    that.endPos -= entriesPerPage;
                    
                    //lager nye rader med de nye startPos og endPos verdiene
                    //må lage inn nye headere slik at de vises 
                    that.makeTableHeader();
                    that.makeTableContent();
                    that.removePageNumber();
                    that.makePageNumber();
                    
                }
            });
            
            //Når siden lastes første gang kjøres disse
            that.makeTableContent();
            that.removeLoadingIcon();
            that.makePageNumber();
            
        });
    }
    
    makeTableHeader() {
        var listeTR = document.createElement('tr');
        this.table.appendChild(listeTR);
        
        var TH0 = document.createElement('th');
        TH0.innerHTML = '#';
        listeTR.appendChild(TH0);
        
        var TH1 = document.createElement('th');
        TH1.innerHTML = 'Name';
        listeTR.appendChild(TH1);
        
        var TH2 = document.createElement('th');
        TH2.innerHTML = 'Link to homepage';
        listeTR.appendChild(TH2);
        
        var TH3 = document.createElement('th');
        TH3.innerHTML = 'Language';
        listeTR.appendChild(TH3);
        
        var TH4 = document.createElement('th');
        TH4.innerHTML = 'Link to API';
        listeTR.appendChild(TH4);
        
        var TH5 = document.createElement('th');
        TH5.innerHTML = 'Description';
        listeTR.appendChild(TH5);
    }
        
    makeTableContent() {
        
        for(var i = this.startPos; i<this.endPos; i++){  
            //lager table rad:
            var listeTR = document.createElement('tr');
            this.table.appendChild(listeTR);
            
            
            this.counter =i+1;
            //legger til all info på raden
            var TD0 = document.createElement('td');
            if(this.counter <= this.repositories.length){
                TD0.innerHTML = this.counter;
                listeTR.appendChild(TD0);
            }
            TD0.style.width = '1%';
            
            var TD1 = document.createElement('td');
            TD1.innerHTML = this.repositories[i].name;
            listeTR.appendChild(TD1);
            TD1.style.width = '10%';

            var TD2 = document.createElement('td');
            TD2.innerHTML = '<a href='+this.repositories[i].homepage+'>'+this.repositories[i].homepage+'</a>';
            listeTR.appendChild(TD2);
            TD2.style.width = '25%';

            var TD3 = document.createElement('td');
            TD3.innerHTML = this.repositories[i].language;
            listeTR.appendChild(TD3);
            TD3.style.width = '4%';

            var TD4 = document.createElement('td');
            TD4.innerHTML = '<a href='+this.repositories[i].url+'>'+this.repositories[i].url+'</a>';
            listeTR.appendChild(TD4);
            TD4.style.width = '25%';

            var TD5 = document.createElement('td');
            TD5.innerHTML = this.repositories[i].description;
            listeTR.appendChild(TD5);
            TD5.style.width = '35%';
        }
    }
    
    
    
}