/**
 * Created by czeleznick002 on 08.10.2018.
 */
({
    loadMealPlans: function (cmp, mealPlanId) {
        this.showElement(cmp, 'spinner');

        this.callServer(cmp, 'c.getMealPlansAura', {mealPlanId: mealPlanId},
            this.processMealPlansResults.bind(this, cmp, mealPlanId)
        );
    },

    processMealPlansResults: function (cmp, mealPlanId, results) {
        if(mealPlanId) {
            this.processSaveMealPlanResult(cmp, results[0]);
            return;
        }

        this.addDayOfWeekToAllMealPlans(results);
        this.calculateMealPlanNutrients(results);
        cmp.set('v.mealPlans', results);
        let currentDate = new Date();
        let startingIndex, endIndex;

        let currentMealPlanIdx = results.findIndex(mealPlan =>
        new Date(mealPlan.day) === currentDate);

        if(currentMealPlanIdx !== -1) {
            startingIndex = currentMealPlanIdx;
        } else {
            startingIndex = results.length > 0 ? results.length - 1 : 0;
        }

        endIndex = startingIndex + 6;


        this.fillInBookWithNewMealPlans(cmp, endIndex + 1);
        cmp.set('v.startingIndex', startingIndex);
        cmp.set('v.endIndex', endIndex);

        this.setPositionOfMealPlanSlider(cmp);
        this.hideElement(cmp, 'spinner');
    },

    addDayOfWeekToAllMealPlans: function(mealPlans) {
        let helper = this;
        mealPlans.forEach(mealPlan => mealPlan.dayOfWeek = helper.getDayOfWeek(mealPlan.day));
    },

    calculateMealPlanNutrients: function(results) {
        results.forEach(mealPlan => mealPlan.meals.forEach(meal => {
            mealPlan.protein = mealPlan.protein || 0 + meal.protein;
            mealPlan.carbs = mealPlan.carbs || 0 + meal.carbs;
            mealPlan.fat = mealPlan.fat || 0 + meal.fat;
            mealPlan.kcal = mealPlan.kcal || 0 + meal.kcal;
        }));

    },

    fillInBookWithNewMealPlans: function(cmp, neededNumber) {
        let mealPlans = cmp.get('v.mealPlans');
        let numberOfMealPlans = mealPlans.length;

        if(numberOfMealPlans >= neededNumber) {
            return;
        }

        let missingNumber = neededNumber - numberOfMealPlans;
        let lastMealDay = numberOfMealPlans <= 0 ? new Date() : new Date(mealPlans[numberOfMealPlans - 1].day);

        for(let i = 0; i < missingNumber; i++) {
            lastMealDay.setDate(lastMealDay.getDate() + 1);
            this.addMealPlan(cmp, mealPlans, new Date(lastMealDay));
        }

        cmp.set('v.mealPlans', mealPlans);
        this.consoleLog(mealPlans);
    },

    addMealPlan: function (cmp, existingMealPlans, day, meals) {
        let helper = this;
        let dayString = $A.localizationService.formatDate(day, "YYYY-MM-DD");
        let dayOfWeek = helper.getDayOfWeek(day);
        let contactId = cmp.get('v.contact.record.Id');

        let mealPlan = {
           name: '',
           day: dayString,
           dayOfWeek: dayOfWeek,
           meals: meals || [],
           contactId: contactId
        };

        for(let i = 0; i < 5; i++) {
            this.addMeal(mealPlan);
        }

        existingMealPlans.push(mealPlan);
    },

    addMeal: function(mealPlan) {
        let meals = mealPlan.meals;

        meals.push({
            name: '',
            products: [],
            protein: 0,
            carbs: 0,
            fat: 0,
            kcal: 0,
            weight: 0,
            name: ''
        });
    },

    saveMealPlans: function (cmp) {
        let mealPlans = cmp.get('v.mealPlans');
        let params = {
            mealPlansJson: JSON.stringify(mealPlans)
        }

        this.callServer(cmp, 'c.saveMealPlansAura', params,
            this.processSaveMealPlansResults.bind(this, cmp)
        );
    },

    processSaveMealPlansResults: function(cmp, results) {
        this.hideElement(cmp, 'spinner');
    },

    saveMeal: function(cmp, meal, mealPlanIndex, mealIndex) {
        this.showElement(cmp, 'spinner');

        let mealPlan = cmp.get('v.mealPlans')[mealPlanIndex];

        this.callServer(cmp, 'c.saveMealAura', {mealJson: JSON.stringify(meal), mealPlanJson: JSON.stringify(mealPlan)},
            this.processSaveMealResult.bind(this, cmp, mealPlanIndex, mealIndex)
        );
    },

    processSaveMealResult: function(cmp, mealPlanIndex, mealIndex, result) {
        let mealPlans = cmp.get('v.mealPlans');

//        let mealPlanIdx = mealPlans.findIndex(mealPlan => mealPlan.id === result.mealPlanId);
//        let updatedMealPlanIdx = mealPlans[mealPlanIndex].meals.findIndex(meal => meal.id === result.id);

        mealPlans[mealPlanIndex].meals[mealIndex] = result;

        this.hideElement(cmp, 'spinner');

        this.loadMealPlans(cmp, result.mealPlanId);
    },

    saveMealPlan: function(cmp, mealPlan) {
        this.showElement(cmp, 'spinner');

        this.callServer(cmp, 'c.saveMealPlanAura', {mealPlanJson: JSON.stringify(mealPlan)},
            this.processSaveMealPlanResult.bind(this, cmp)
        );
    },

    processSaveMealPlanResult: function(cmp, result) {
        let mealPlans = cmp.get('v.mealPlans');
        mealPlans.push(result);

        cmp.set('v.mealPlans', mealPlans);
        this.hideElement(cmp, 'spinner');
    },

    removeMealPlanMeal: function(cmp, mealPlanMealId, mealPlanIndex) {
        let mealPlans = cmp.get('v.mealPlans');
        let mealPlanToUpdate = mealPlans[mealPlanIndex];
        let mealIdsToRemove = mealPlanToUpdate.mealPleanMealIdsToRemove || [];
        mealIdsToRemove.push(mealPlanMealId);
        mealPlanToUpdate.mealPleanMealIdsToRemove = mealIdsToRemove;

        this.saveMealPlan(cmp, mealPlanToUpdate);
    },

    setPositionOfMealPlanSlider: function(cmp) {
        let startingIndex = cmp.get('v.startingIndex');

        if(startingIndex > 0) {
            this.addCssTransform(cmp, true, startingIndex);
        }
    },

    movePage: function(cmp, isNext) {
        let endIndex = cmp.get('v.endIndex');
        let startingIndex = cmp.get('v.startingIndex');
        let mealPlans = cmp.get('v.mealPlans');

        if(isNext && mealPlans.length <= endIndex + 1) {
            let lastMealDay = new Date(mealPlans[endIndex].day);
            lastMealDay.setDate(lastMealDay.getDate() + 1);
            this.addMealPlan(cmp, mealPlans, lastMealDay);
            cmp.set('v.mealPlans', mealPlans);
        }

        if(isNext || startingIndex > 0) {
            this.addCssTransform(cmp, isNext);
        }

        if(isNext) {
            endIndex += 1;
            startingIndex += 1;
        } else if(startingIndex > 0){
            endIndex -= 1;
            startingIndex -= 1;
        }

        cmp.set('v.endIndex', endIndex);
        cmp.set('v.startingIndex', startingIndex);
    },

    addCssTransform: function(cmp, isNext, numberOfElementsToMove) {
//        let root = document.querySelector(":root");
//        let rootSize = parseFloat(window.getComputedStyle(root, null).getPropertyValue('font-size'));
        let slideList = cmp.find('slideList').getElement();
        let singleMealPlanWidth = slideList.getBoundingClientRect().width / 7;
        let slideListTransitionPosition = cmp.get('v.slideListTransitionPosition')
        let style = slideList.currentStyle || window.getComputedStyle(slideList);
        let widthToMove = singleMealPlanWidth * (numberOfElementsToMove || 1);
//        let widthToMove = singleMealPlanDiv.width + 2 * parseFloat(style.paddingRight) * (numberOfElementsToMove || 1);

        slideListTransitionPosition += isNext ? - widthToMove : widthToMove;
        cmp.set('v.slideListTransitionPosition', slideListTransitionPosition);

        slideList.style.transform = `translate3d(${slideListTransitionPosition}px, 0px, 0px)`;
        slideList.style.OTransform = `translate3d(${slideListTransitionPosition}px, 0, 0px))`;          // Opera
        slideList.style.msTransform = `translate3d(${slideListTransitionPosition}px, 0, 0px))`;         // IE 9
        slideList.style.MozTransform = `translate3d(${slideListTransitionPosition}px, 0, 0px))`;        // Firefox
        slideList.style.WebkitTransform = `translate3d(${slideListTransitionPosition}px, 0, 0px))`;     // Safari and Chrome
    },

    searchProduct: function(cmp, searchPhrase, spinner) {
        this.callServer(cmp, 'c.getProductsAura', {searchPhrase: searchPhrase},
            this.processSearchProductResults.bind(this, cmp, spinner),
            this.handleErrorOwn.bind(this, cmp, spinner)
        );
    },

    processSearchProductResults: function(cmp, spinner, results) {
        cmp.set('v.products', results);

        this.hideOwnElement(spinner);
    },

    handleErrorOwn: function(cmp, spinner, errors) {
        this.handleError(cmp, errors, spinner);
    },
})