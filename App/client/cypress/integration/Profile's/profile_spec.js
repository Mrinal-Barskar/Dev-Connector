describe('test for Profiles', function() {
    it('tests', function() {
        cy.visit('http://localhost:3000/profiles')

        cy.get('.container div').first()

        // cy.get('section').within(() => {
        //     cy.get('div').first().contains('view Profile', {matchCase : false}).click()
        //   })
    })

    it('test again', function() {
        cy.hash()

        const fn1 = () => {
            return 'bar'
          }
          
        cy.wrap({ foo : fn1 }).invoke('foo').should('eq', 'bar')

        const fn2 = (a, b, c) => {
            return a + b + c
          }
          
          cy
            .wrap({ sum: fn2 })
            .invoke('sum', 2, 4, 6)
              .should('be.gt', 10)
              .and('be.lt', 20)

        const fn3 = () => {
            return 42
        }
        
        cy.wrap({ getNum: fn3 }).its('getNum').should('be.a', 'function')

        const user = {
            contacts: {
              work: {
                name: 'Kamil'
              }
            }
          }
          
          cy.wrap(user).its('contacts.work.name').should('eq', 'Kamil')

          cy.window().its('evilProp').should('not.exist')
    })
})