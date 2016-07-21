System.register(['@angular/core', 'rxjs/Rx', '@angular/http', '../global/global-functions', '../global/mlb-global-functions', '../global/global-settings'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, Rx_1, http_1, global_functions_1, mlb_global_functions_1, global_settings_1;
    var SearchService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            SearchService = (function () {
                function SearchService(http) {
                    this.http = http;
                    this.pageMax = 10;
                    this.searchAPI = global_settings_1.GlobalSettings.getApiUrl() + '/landingPage/search';
                    //Get initial search JSON data
                    this.getSearchJSON();
                }
                //Function get search JSON object
                SearchService.prototype.getSearchJSON = function () {
                    var _this = this;
                    // console.log(this.searchAPI);
                    return this.http.get(this.searchAPI, {})
                        .map(function (res) { return res.json(); }).subscribe(function (data) {
                        _this.searchJSON = data;
                    }, function (err) {
                        console.log('ERROR search results');
                        _this.searchJSON = null;
                    });
                };
                //Function get search JSON object
                SearchService.prototype.getSearch = function () {
                    // console.log(this.searchAPI);
                    return this.http.get(this.searchAPI, {})
                        .map(function (res) { return res.json(); }).map(function (data) {
                        return data;
                    }, function (err) {
                        console.log('ERROR search results');
                    });
                };
                /*
                 *  Functions for search component
                 */
                //Function used by search input to get suggestions dropdown
                SearchService.prototype.getSearchDropdownData = function (term) {
                    //TODO: Wrap in async
                    var data = this.searchJSON;
                    //Search for players and teams
                    var playerResults = this.searchPlayers(term, data.players);
                    var teamResults = this.searchTeams(term, data.teams);
                    //Transform data to useable format
                    var searchResults = this.resultsToDropdown(playerResults, teamResults);
                    //Build output to send to search component
                    var searchOutput = {
                        term: term,
                        searchResults: searchResults
                    };
                    return Rx_1.Observable.of(searchOutput);
                };
                //Convert players and teams to needed dropdown array format
                SearchService.prototype.resultsToDropdown = function (playerResults, teamResults) {
                    var searchArray = [];
                    var count = 0, max = 4;
                    for (var i = 0, length_1 = teamResults.length; i < length_1; i++) {
                        //Exit loop if max dropdown count
                        if (count >= max) {
                            break;
                        }
                        var item = teamResults[i];
                        var teamName = item.teamName;
                        count++;
                        searchArray.push({
                            title: teamName,
                            value: teamName,
                            imageUrl: {
                                imageClass: "image-43",
                                mainImage: {
                                    imageUrl: global_settings_1.GlobalSettings.getImageUrl(item.teamLogo),
                                    hoverText: "<i class='fa fa-mail-forward search-text'></i>",
                                    imageClass: "border-1",
                                    urlRouteArray: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(teamName, item.teamId),
                                }
                            },
                            routerLink: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(teamName, item.teamId)
                        });
                    }
                    for (var i = 0, length_2 = playerResults.length; i < length_2; i++) {
                        //Exit loop if max dropdown count
                        if (count >= max) {
                            break;
                        }
                        count++;
                        var item = playerResults[i];
                        var playerName = item.playerName;
                        searchArray.push({
                            title: '<span class="text-heavy">' + playerName + '</span> - ' + item.teamName,
                            value: playerName,
                            imageUrl: {
                                imageClass: "image-43",
                                mainImage: {
                                    imageUrl: global_settings_1.GlobalSettings.getImageUrl(item.imageUrl),
                                    urlRouteArray: mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId),
                                    hoverText: "<i class='fa fa-mail-forward search-text'></i>",
                                    imageClass: "border-1"
                                }
                            },
                            routerLink: mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId)
                        });
                    }
                    return searchArray;
                };
                //Function to build search route
                SearchService.prototype.getSearchRoute = function (term) {
                    var searchRoute;
                    //Build search Route
                    if (term) {
                        searchRoute = ['Search-page', { query: term }];
                    }
                    else {
                        searchRoute = null;
                    }
                    return searchRoute !== null ? searchRoute : ['Error-page'];
                };
                /*
                 * Functions for search page
                 */
                SearchService.prototype.getSearchPageData = function (router, partnerId, query, data) {
                    // let data = this.searchJSON;
                    //Search for players and teams
                    var playerResults = this.searchPlayers(query, data.players);
                    var teamResults = this.searchTeams(query, data.teams);
                    var searchResults = this.resultsToTabs(router, partnerId, query, playerResults, teamResults);
                    return searchResults;
                };
                //Convert players and teams to tabs format
                SearchService.prototype.resultsToTabs = function (router, partnerId, query, playerResults, teamResults) {
                    // console.log('results to Tabs', playerResults, teamResults);
                    var self = this;
                    var searchPageInput = {
                        searchComponent: {
                            placeholderText: 'Search for a player or team...',
                            hasSuggestions: true,
                            initialText: query
                        },
                        heroImage: '/app/public/homePage_hero1.png',
                        headerText: 'Discover The Latest In Baseball',
                        subHeaderText: 'Find the Players and Teams you love.',
                        query: query,
                        tabData: [
                            {
                                tabName: 'Player (' + playerResults.length + ')',
                                isTabDefault: playerResults.length >= teamResults.length ? true : false,
                                results: [],
                                error: {
                                    message: "Sorry we can't find a <span class='text-heavy'>Player Profile</span> matching your search term(s) ''<span class='query-blue'>" + query + "</span>'', please try your search again.",
                                    icon: 'noSearch'
                                },
                                pageMax: this.pageMax,
                                totalResults: playerResults.length,
                                paginationParameters: {
                                    index: 1,
                                    max: 10,
                                    paginationType: 'module'
                                }
                            },
                            {
                                tabName: 'Team (' + teamResults.length + ')',
                                isTabDefault: teamResults.length > playerResults.length ? true : false,
                                results: [],
                                error: {
                                    message: "Sorry we can't find a <span class='text-heavy'>Team Profile</span> matching your search term(s) '<span class='query-blue'>" + query + "</span>', please try your search again.",
                                    icon: 'noSearch'
                                },
                                pageMax: this.pageMax,
                                totalResults: teamResults.length,
                                paginationParameters: {
                                    index: 1,
                                    max: 10,
                                    paginationType: 'module'
                                }
                            }
                        ]
                    };
                    var setTabDefault = searchPageInput.tabData;
                    var objCounter = 0;
                    var objData1 = [];
                    playerResults.forEach(function (item) {
                        var playerName = item.playerName;
                        var title = global_functions_1.GlobalFunctions.convertToPossessive(playerName) + " Player Profile";
                        //TODO: use router functions to get URL
                        // let urlText = 'http://www.homerunloyal.com/';
                        // urlText += '<span class="text-heavy">player/' + GlobalFunctions.toLowerKebab(item.teamName) + '/' + GlobalFunctions.toLowerKebab(playerName) + '/' + item.playerId + '</span>';
                        var route = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId);
                        var relativePath = router.generate(route).toUrlPath();
                        if (relativePath.length > 0 && relativePath.charAt(0) == '/') {
                            relativePath = relativePath.substr(1);
                        }
                        var urlText = global_settings_1.GlobalSettings.getHomePage(partnerId, false) + '/<span class="text-heavy">' + relativePath + '</span>';
                        var regExp = new RegExp(playerName, 'g');
                        var description = item.playerDescription.replace(regExp, ('<span class="text-heavy">' + playerName + '</span>'));
                        if (typeof objData1[objCounter] == 'undefined' || objData1[objCounter] === null) {
                            objData1[objCounter] = [];
                            objData1[objCounter].push({
                                title: title,
                                urlText: urlText,
                                url: route,
                                description: description
                            });
                        }
                        else {
                            objData1[objCounter].push({
                                title: title,
                                urlText: urlText,
                                url: route,
                                description: description
                            });
                            if (objData1[objCounter].length >= self.pageMax) {
                                objCounter++;
                            }
                        }
                    });
                    searchPageInput.tabData[0].results = objData1;
                    searchPageInput.tabData[0].paginationParameters.max = searchPageInput.tabData[0].results.length;
                    var objCounter = 0;
                    var objData2 = [];
                    teamResults.forEach(function (item) {
                        var teamName = item.teamName;
                        var title = global_functions_1.GlobalFunctions.convertToPossessive(teamName) + " Team Profile";
                        //TODO: use router functions to get URL
                        // let urlText = 'http://www.homerunloyal.com/';
                        // urlText += '<span class="text-heavy">team/' + GlobalFunctions.toLowerKebab(teamName) + '/' + item.teamId;
                        var route = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(teamName, item.teamId);
                        var relativePath = router.generate(route).toUrlPath();
                        if (relativePath.length > 0 && relativePath.charAt(0) == '/') {
                            relativePath = relativePath.substr(1);
                        }
                        var urlText = global_settings_1.GlobalSettings.getHomePage(partnerId, false) + '/<span class="text-heavy">' + relativePath + '</span>';
                        var regExp = new RegExp(teamName, 'g');
                        var description = item.teamDescription.replace(regExp, ('<span class="text-heavy">' + teamName + '</span>'));
                        if (typeof objData2[objCounter] == 'undefined' || objData2[objCounter] === null) {
                            objData2[objCounter] = [];
                            objData2[objCounter].push({
                                title: title,
                                urlText: urlText,
                                url: route,
                                description: description
                            });
                        }
                        else {
                            objData2[objCounter].push({
                                title: title,
                                urlText: urlText,
                                url: route,
                                description: description
                            });
                            if (objData2[objCounter].length >= self.pageMax) {
                                objCounter++;
                            }
                        }
                    });
                    searchPageInput.tabData[1].results = objData2;
                    searchPageInput.tabData[1].paginationParameters.max = searchPageInput.tabData[1].results.length;
                    return searchPageInput;
                };
                /*
                 *  Search Functions used by both component and page
                 */
                SearchService._orderByComparatorPlayer = function (a, b) {
                    if ((a.score - b.score) == 0) {
                        if (a.item.playerName.toLowerCase() > b.item.playerName.toLowerCase()) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    }
                    else {
                        return a.score - b.score;
                    }
                };
                SearchService._orderByComparatorTeam = function (a, b) {
                    if ((a.score - b.score) == 0) {
                        if (a.item.teamName.toLowerCase() > b.item.teamName.toLowerCase()) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    }
                    else {
                        return a.score - b.score;
                    }
                };
                //Function to search through players. Outputs array of players that match criteria
                SearchService.prototype.searchPlayers = function (term, data) {
                    var fuse = new Fuse(data, {
                        //Fields the search is based on
                        keys: [{
                                name: 'playerFirstName',
                                weight: 0.5
                            }, {
                                name: 'playerLastName',
                                weight: 0.3
                            }, {
                                name: 'playerName',
                                weight: 0.2
                            }],
                        //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location),
                        // a threshold of 1.0 would match anything.
                        threshold: 0.1,
                        distance: 10,
                        tokenize: false,
                        sortFn: SearchService._orderByComparatorPlayer
                    });
                    return fuse.search(term);
                };
                //Function to search through teams. Outputs array of teams that match criteria
                SearchService.prototype.searchTeams = function (term, data) {
                    var fuse = new Fuse(data, {
                        //Fields the search is based on
                        keys: ['teamName'],
                        //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
                        threshold: 0.2,
                        shouldSort: true,
                        sortFn: SearchService._orderByComparatorTeam
                    });
                    return fuse.search(term);
                };
                SearchService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], SearchService);
                return SearchService;
            }());
            exports_1("SearchService", SearchService);
        }
    }
});
