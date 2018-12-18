'use strict'

describe 'Directive: breadcrumbs', ->

  scope = {}
  element = null
  $location = {}

  beforeEach ->
    $location.path = jasmine.createSpy('path')

    module 'breadcrumbs', ($provide) ->
      $provide.provider "$location", ->
        $get: -> $location
      null

  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()
    element = angular.element '<breadcrumbs></breadcrumbs>'

  describe 'when creating the markup', ->
    beforeEach inject ($compile) ->
      element = $compile(element) scope

    it 'should be positioned relative for transcluded elements', ->
      expect(element.css('position')).toEqual 'relative'

    it 'should have an unordered list with the class breadcrumbs', ->
      expect(element.find('ul').length).not.toEqual 0
      expect(element.find('ul').hasClass('breadcrumb')).toBeTruthy()

  describe 'when the location is at the root of the app', ->
    beforeEach inject ($rootScope, $compile) ->
      element = $compile(element) scope

      $location.path.andReturn '/'
      $rootScope.$emit '$routeChangeSuccess'
      scope.$digest()

    it 'should have the home breadcrumb', ->
      expect(element.find('li span').text()).toEqual 'Home'

    it 'should have no link on the home breadcrumb', ->
      expect(element.find('li a').length).toEqual 0

    it 'should have no divider', ->
      expect(element.find('.divider').length).toEqual 0

  describe 'when the location is deep', ->
    beforeEach inject ($rootScope, $compile) ->
      element = $compile(element) scope

      $location.path.andReturn '/Google/Apps/Gmail'
      $rootScope.$emit '$routeChangeSuccess'
      scope.$digest()

    it 'should have the home breadcrumb', ->
      expect(element.find('li:first-child span').text()).toEqual 'Home'

    it 'should have a link on the home breadcrumb', ->
      expect(element.find('li:first-child span a').length).not.toEqual 0
      expect(element.find('li:first-child span a').attr('href')).toEqual '/'

    it 'should have other breadcrumbs with dividers', ->
      expect(element.find('li:nth-child(2) span').first().text()).toEqual '/'
      expect(element.find('li:nth-child(2) span').last().text()).toEqual 'Google'
      expect(element.find('li:nth-child(2) span:last-child a').attr('href')).toEqual '/Google'

      expect(element.find('li:nth-child(3) span').first().text()).toEqual '/'
      expect(element.find('li:nth-child(3) span').last().text()).toEqual 'Apps'
      expect(element.find('li:nth-child(3) span:last-child a').attr('href')).toEqual '/Google/Apps'

    it 'should have the last breadcrumb without a link', ->
      expect(element.find('li:nth-child(4) span').first().text()).toEqual '/'
      expect(element.find('li:nth-child(4) span').last().text()).toEqual 'Gmail'
      expect(element.find('li:nth-child(4) span:last-child a').length).toEqual 0

  describe 'when there are nested elements to be transcluded', ->
    beforeEach inject ($compile) ->
      element = angular.element '<breadcrumbs><span>Logout</span></breadcrumbs>'
      element = $compile(element) scope

    it 'should have the breadcrumb class', ->
      expect(element.find('span').hasClass('breadcrumb')).toBeTruthy()

    it 'should have correct styles to inline the nest elements', ->
      expect(element.find('span').css('position')).toEqual 'absolute'
      expect(element.find('span').css('top')).toEqual '0px'
      expect(element.find('span').css('right')).toEqual '0px'

    it 'should transclude', ->
      expect(element.find('span.breadcrumb').text()).toEqual 'Logout'