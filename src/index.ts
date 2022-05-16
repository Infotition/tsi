#!/usr/bin/env node

import sade from 'sade';
import * as commands from './commands';

const prog = sade('tsi');

commands.create(prog);
commands.publish(prog);
commands.storybook(prog);
commands.clean(prog);
commands.watch(prog);
commands.build(prog);
commands.lint(prog);
commands.test(prog);
commands.docs(prog);

prog.parse(process.argv);
