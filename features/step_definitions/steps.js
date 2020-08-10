const { 
  After: after,
  Before: before,
  When: when,
  Then: then
} = require('cucumber');
const { exec } = require("child_process")

before((testCase, callback) => {
  exec("docker run -itd --name cucumber-shell-tests alpine:3.12", 
    (err, stdout, stderr) => {
      callback(err)
    }
  )
});

after((tests, callback) => {
  exec("docker rm -f cucumber-shell-tests", 
    (err, stdout, stderr) => {
      callback(err)
    }
  )
});

when(/^I run (.*)$/, (cmd, callback) => {
  exec("docker exec aac-tests " + cmd, 
    (err, stdout, stderr) => {
      this.err = err 
      this.stdout = stdout
      this.stderr = stderr
      callback()
    }
  )
});
then(/^the command should(n't)? fail$/, (shouldFail, callback) => {
  callback(shouldFail === this.err)
})

then(/^stdout should contain (.*)$/, (str, callback) => {
  result = this.stdout.indexOf(str) != -1
  callback(!result && {expected: str, actual: this.stdout})
});

then(/^stderr should contain (.*)$/, (str, callback) => {
  result = this.stderr.indexOf(str) != -1
  callback(!result && {expected: str, actual: this.stderr})
});


